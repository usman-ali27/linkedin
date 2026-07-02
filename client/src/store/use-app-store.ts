import { create } from "zustand";
import api from "@/lib/api";
import type { PostData } from "@/components/feed";

export type AuthPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = AuthPayload & {
  fullName: string;
};

export type AppUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

type AppState = {
  user: AppUser | null;
  authenticated: boolean;
  authMode: "signin" | "signup";
  authError?: string;
  isLoading: boolean;
  posts: PostData[];
  postDraft: string;
  likedPosts: Record<number, boolean>;
  commentDrafts: Record<number, string>;
  isFeedLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  page: number;
  setUser: (user: AppUser | null) => void;
  setAuthenticated: (value: boolean) => void;
  setAuthMode: (mode: "signin" | "signup") => void;
  setAuthError: (error?: string) => void;
  setIsLoading: (value: boolean) => void;
  setPostDraft: (draft: string) => void;
  setCommentDraft: (postId: number, value: string) => void;
  clearSession: () => void;
  resetFeed: () => void;
  prependPost: (post: PostData) => void;
  updatePostLikes: (postId: number, likesCount: number) => void;
  toggleLikedPost: (postId: number) => void;
  addCommentToPost: (
    postId: number,
    comment: PostData["comments"][number],
  ) => void;
  loadFeedPage: (append?: boolean) => Promise<void>;
  createPost: (content: string, currentUser: AppUser | null) => Promise<void>;
  toggleLike: (postId: number) => Promise<void>;
  addComment: (postId: number, currentUser: AppUser | null) => Promise<void>;
};

const formatPost = (post: any): PostData => ({
  id: post.id,
  author: post.author?.fullName || "Unknown",
  role: post.author?.role || "Professional",
  time: new Date(post.createdAt).toLocaleDateString(),
  audience: "Anyone",
  content: post.content,
  image: post.image || "linear-gradient(135deg, #0f172a 0%, #0ea5e9 100%)",
  likesCount: post.likesCount ?? 0,
  comments: (post.comments || []).map((comment: any) => ({
    author: comment.author?.fullName || "Anonymous",
    time: new Date(comment.createdAt).toLocaleDateString(),
    text: comment.content || comment.text || "",
  })),
  tags: ["insight"],
});

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  authenticated: false,
  authMode: "signin",
  authError: undefined,
  isLoading: false,
  posts: [],
  postDraft: "",
  likedPosts: {},
  commentDrafts: {},
  isFeedLoading: false,
  isLoadingMore: false,
  hasMore: true,
  page: 0,
  setUser: (user) => set({ user }),
  setAuthenticated: (value) => set({ authenticated: value }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setAuthError: (error) => set({ authError: error }),
  setIsLoading: (value) => set({ isLoading: value }),
  setPostDraft: (draft) => set({ postDraft: draft }),
  setCommentDraft: (postId, value) =>
    set((state) => ({
      commentDrafts: { ...state.commentDrafts, [postId]: value },
    })),
  clearSession: () =>
    set({
      user: null,
      authenticated: false,
      authError: undefined,
      isLoading: false,
      posts: [],
      postDraft: "",
      likedPosts: {},
      commentDrafts: {},
      isFeedLoading: false,
      isLoadingMore: false,
      hasMore: true,
      page: 0,
    }),
  resetFeed: () =>
    set({
      posts: [],
      postDraft: "",
      likedPosts: {},
      commentDrafts: {},
      isFeedLoading: false,
      isLoadingMore: false,
      hasMore: true,
      page: 0,
    }),
  prependPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePostLikes: (postId, likesCount) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, likesCount } : post,
      ),
    })),
  toggleLikedPost: (postId) =>
    set((state) => ({
      likedPosts: { ...state.likedPosts, [postId]: !state.likedPosts[postId] },
    })),
  addCommentToPost: (postId, comment) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post,
      ),
    })),
  loadFeedPage: async (append = false) => {
    const nextPage = append ? get().page + 1 : 0;
    set({ isFeedLoading: !append, isLoadingMore: append });

    try {
      const response = await api.get("/posts/feed", {
        params: { page: nextPage, limit: 10 },
      });

      const backendPosts = response.data.posts ?? response.data ?? [];
      const fetchedPosts = backendPosts.map(formatPost);

      set((state) => ({
        posts: append ? [...state.posts, ...fetchedPosts] : fetchedPosts,
        page: nextPage,
        hasMore: response.data.hasMore ?? fetchedPosts.length === 10,
        isFeedLoading: false,
        isLoadingMore: false,
      }));
    } catch (error) {
      console.error("Failed to fetch feed", error);
      set({ isFeedLoading: false, isLoadingMore: false });
    }
  },
  createPost: async (content) => {
    const trimmed = content.trim();
    const currentUser = get().user;
    if (!trimmed || !currentUser) return;

    try {
      const response = await api.post("/posts", { content: trimmed });
      const newPost: PostData = {
        id: response.data.post.id,
        author: currentUser.fullName,
        role: currentUser.role || "Professional",
        time: "just now",
        audience: "Anyone",
        content: trimmed,
        image: "linear-gradient(135deg, #0f172a 0%, #0ea5e9 100%)",
        likesCount: 0,
        comments: [],
        tags: ["new"],
      };

      get().prependPost(newPost);
      set({ postDraft: "" });
    } catch (error) {
      console.error("Failed to create post", error);
      alert("Failed to post. Check console.");
    }
  },
  toggleLike: async (postId) => {
    const previous = get().likedPosts[postId];
    get().toggleLikedPost(postId);

    try {
      const response = await api.post(`/posts/like/${postId}`);
      const currentPost = get().posts.find((post) => post.id === postId);
      if (currentPost) {
        const nextLikes = response.data.liked
          ? currentPost.likesCount + 1
          : Math.max(0, currentPost.likesCount - 1);
        get().updatePostLikes(postId, nextLikes);
      }
    } catch (error) {
      get().toggleLikedPost(postId);
      console.error("Failed to toggle database like state", error);
      alert("Could not sync like status with the server.");
    }
  },
  addComment: async (postId, currentUser) => {
    const draft = get().commentDrafts[postId]?.trim();
    if (!draft || !currentUser) return;

    const comment = {
      author: currentUser.fullName ?? "You",
      time: "just now",
      text: draft,
    };

    get().addCommentToPost(postId, comment);
    set((state) => ({
      commentDrafts: { ...state.commentDrafts, [postId]: "" },
    }));
  },
}));
