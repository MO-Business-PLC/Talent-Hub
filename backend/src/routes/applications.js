import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// GET /applications/employer → retrieve all applications for all jobs created by logged-in employer
router.get("/employer", auth, async (req, res) => {
  try {
    const userId = req.user?.id;

    // Validate user exists and is employer/admin
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!["employer", "admin"].includes(user.role)) {
      return res.status(400).json({ error: "User is not an employer" });
    }

    // Get all jobs created by this employer
    const jobs = await Job.find({ createdBy: userId }).select("_id");
    const jobIds = jobs.map(job => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .populate({ path: "userId", select: "name email role" })
      .populate({ path: "jobId", select: "title location status" });

    return res.status(200).json({ applications });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /applications/job/:jobId → retrieve applications for a specific job (employer owner or admin)
router.get("/job/:jobId", auth, async (req, res) => {
  try {
    const { jobId } = req.params;

    // Ensure job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Only the job owner (employer) or admins can view applications for this job
    const isAdmin = req.user?.role === "admin";
    const isOwner = String(job.createdBy) === String(req.user?.id);
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const applications = await Application.find({ jobId: job._id })
      .sort({ createdAt: -1 })
      .populate({ path: "userId", select: "name email role" })
      .populate({ path: "jobId", select: "title location status" });

    return res.status(200).json({ applications });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /applications → apply to a job
router.post("/", auth, async (req, res) => {
  try {
    const { jobId, resumeUrl, coverLetter } = req.body || {};

    if (!jobId || !resumeUrl) {
      return res.status(400).json({ error: "jobId and resumeUrl are required" });
    }

    // Ensure job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    if (job.status !== "OPEN") {
      return res.status(400).json({ error: "Job is not open for applications" });
    }

    // Ensure user exists (from token)
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Create application
    const application = await Application.create({
      jobId: job._id,
      userId: user._id,
      resumeUrl,
      ...(coverLetter ? { coverLetter } : {}),
    });

    const populated = await application
      .populate({ path: "jobId", select: "title location status" })
      .populate({ path: "userId", select: "name email role" })
      .execPopulate?.();

    // execPopulate is deprecated in newer mongoose; if not available, populated is undefined.
    const result = populated || (await Application.findById(application._id)
      .populate({ path: "jobId", select: "title location status" })
      .populate({ path: "userId", select: "name email role" }));

    return res.status(201).json({ application: result });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "You have already applied to this job" });
    }
    if (err?.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /applications/:userId → retrieve user applications
router.get("/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Only the user themselves or admins can view
    if (req.user?.id !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const applications = await Application.find({ userId })
      .sort({ createdAt: -1 })
      .populate({ path: "jobId", select: "title location status" });

    return res.status(200).json({ applications });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;


