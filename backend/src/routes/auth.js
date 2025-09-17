import express from "express";
import {
  register,
  login,
  googleStart,
  googleCallback,
  profile,
  refresh,
} from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Public endpoints
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// Google OAuth (redirect flow)
router.get("/google/start", googleStart);
router.get("/google/callback", googleCallback);

router.get("/profile", auth, profile);

export default router;
