import express from "express";
import User from "../models/User.js";
import { generateTokens, verifyToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    // Prevent duplicate email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      ...(role ? { role } : {}),
    });

    const { accessToken, refreshToken } = generateTokens(user);

    // Set secure HttpOnly refresh token cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/api/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const safeUser = user.toJSON();

    return res.status(201).json({
      user: safeUser,
      accessToken,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Email already in use" });
    }
    if (err?.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/api/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const safeUser = user.toJSON();

    return res.status(200).json({
      user: safeUser,
      accessToken,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Refresh access token using HttpOnly cookie
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ error: "Refresh token missing" });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Rotate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/api/auth",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

// Logout: clear refresh token cookie
router.post("/logout", async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/auth",
  });
  return res.status(204).send();
});

export default router;
