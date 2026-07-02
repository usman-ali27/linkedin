import { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, image } = req.body;
    const userId = req.user?.userId; // we'll add middleware later

    const post = await prisma.post.create({
      data: {
        content,
        image: image || null,
        authorId: userId || 1, // temporary
      },
      include: {
        author: true,
      },
    });

    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFeed = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? 10);
    const safePage = Number.isFinite(page) && page > 0 ? page : 0;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 10) : 10;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        take: safeLimit,
        skip: safePage * safeLimit,
        include: {
          author: true,
          comments: {
            include: {
              author: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.post.count(),
    ]);

    res.json({
      posts,
      hasMore: safePage * safeLimit + posts.length < total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleLike = async (req: Request, res: Response) => {
  try {
    // 1. Destructure postId from the params object and parse it to an integer
    const postId = Number(req.params.postId);
    const userId = req.user?.userId;

    // 2. Validate that it's a real number
    if (!postId || Number.isNaN(postId) || !userId) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // 3. Now you don't need to wrap it in Number() anymore!
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: postId, // Already a clean number
          userId: userId,
        },
      },
    });

    if (existingLike) {
      await prisma.$transaction([
        prisma.like.delete({
          where: {
            postId_userId: {
              postId: postId,
              userId: userId,
            },
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      return res.json({ liked: false, message: "Post unliked successfully" });
    } else {
      await prisma.$transaction([
        prisma.like.create({
          data: { postId, userId },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      return res.json({ liked: true, message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
