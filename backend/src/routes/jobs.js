import express from "express";
import { auth, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createJobValidator } from "../validators/jobValidator.js";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByUser
} from "../controllers/jobController.js";

const router = express.Router();

// GET /jobs → get all jobs with optional filtering and pagination
router.get("/", getAllJobs);


// POST /jobs → create new job 
router.post("/", auth, authorize("employer"), createJobValidator, validate, createJob);

// PUT /jobs/:id → update job 
router.put("/:id", auth, authorize("admin", "employer"), createJobValidator, validate, updateJob);

// DELETE /jobs/:id → delete job 
router.delete("/:id", auth, authorize("admin", "employer"), deleteJob);

// GET /jobs/:id → get single job by ID
router.get("/:id", auth, getJobById);

// GET /jobs/user/:userId → get jobs created by specific user
router.get("/user/:userId", auth, authorize("admin", "employer"), getJobsByUser);



export default router;
