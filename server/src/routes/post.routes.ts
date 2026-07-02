import { Router } from "express";
import {
  createPost,
  getFeed,
  toggleLike,
} from "../controllers/post.controller.ts";
import { protect } from "../../middleware/auth.middleware.ts";

const router = Router();

router.post("/", protect, createPost);
router.get("/feed", protect, getFeed);
router.post("/like/:postId", protect, toggleLike);

export default router;
