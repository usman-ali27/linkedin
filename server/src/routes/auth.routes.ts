import { Router } from "express";
import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/auth.controller.ts";
import { protect } from "../../middleware/auth.middleware.ts";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
