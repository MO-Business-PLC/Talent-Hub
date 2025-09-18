import express from "express";
import {
  getJobTrends,
  getApplicationTrends,
  getUserTrends,
  getAnalytics,
} from "../controllers/trendsController.js";
import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication and admin authorization to all trends routes
router.use(auth);
router.use(authorize('admin'));

// Trends endpoints
router.get("/jobs", getJobTrends);
router.get("/applications", getApplicationTrends);
router.get("/users", getUserTrends);
router.get("/analytics", getAnalytics);

export default router;
