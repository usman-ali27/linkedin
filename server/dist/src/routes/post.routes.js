import { Router } from "express";
import { createPost, getFeed, toggleLike } from "../controllers/post.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
const router = Router();
router.post("/", protect, createPost);
router.get("/feed", protect, getFeed);
router.post("/like/:postId", protect, toggleLike);
export default router;
