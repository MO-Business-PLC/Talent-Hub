import express from "express";
import { getPublicStats } from "../controllers/publicStatsController.js";

const router = express.Router();

// Public, read-only stats for homepage
router.get("/stats", getPublicStats);

export default router;


