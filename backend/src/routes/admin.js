import express from "express";
import {
  // User Management
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  
  // Job Management
  getAllJobs,
  updateJobStatus,
  deleteJob,
  
  // Application Management
  getAllApplications,
  updateApplicationStatus,
  
  // Dashboard & Analytics
  getDashboardStats,
  getSystemHealth,
} from "../controllers/adminController.js";
import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication and admin authorization to all admin routes
router.use(auth);
router.use(authorize('admin'));

// ===== DASHBOARD & ANALYTICS =====
router.get("/dashboard", getDashboardStats);
router.get("/system/health", getSystemHealth);

// ===== USER MANAGEMENT =====
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.patch("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);

// ===== JOB MANAGEMENT =====
router.get("/jobs", getAllJobs);
router.patch("/jobs/:jobId/status", updateJobStatus);
router.delete("/jobs/:jobId", deleteJob);

// ===== APPLICATION MANAGEMENT =====
router.get("/applications", getAllApplications);
router.patch("/applications/:applicationId/status", updateApplicationStatus);

export default router;
