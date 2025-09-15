import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

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


