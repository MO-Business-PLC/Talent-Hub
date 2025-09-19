import { validationResult } from "express-validator";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

// Utility for handling validation errors
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(", ") });
  }
};

// GET /applications/employer
export const getEmployerApplications = async (req, res) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!["employer", "admin"].includes(user.role)) {
      return res.status(400).json({ error: "User is not an employer" });
    }

    const jobs = await Job.find({ createdBy: userId }).select("_id");
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .populate({ path: "userId", select: "name email role" })
      .populate({ path: "jobId", select: "title location status" });

    return res.status(200).json({ applications });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /applications/job/:jobId
export const getApplicationsByJob = async (req, res) => {
  const validationErr = handleValidation(req, res);
  if (validationErr) return validationErr;

  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const isAdmin = req.user?.role === "admin";
    const isOwner = String(job.createdBy) === String(req.user?.id);
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const applications = await Application.find({ jobId })
      .sort({ createdAt: -1 })
      .populate({ path: "userId", select: "name email role" })
      .populate({ path: "jobId", select: "title location status" });

    return res.status(200).json({ applications });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /applications
export const applyToJob = async (req, res) => {
  try {
    const { jobId, resumeUrl, coverLetter } = req.body;

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
      jobId,
      userId: user._id,
      resumeUrl,
      ...(coverLetter ? { coverLetter } : {}),
    });

    // Populate response
    const result = await Application.findById(application._id)
      .populate({ path: "jobId", select: "title location status" })
      .populate({ path: "userId", select: "name email role" });

    return res.status(201).json({ application: result });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "You have already applied to this job" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// GET /applications/:userId
export const getUserApplications = async (req, res) => {
  const validationErr = handleValidation(req, res);
  if (validationErr) return validationErr;

  try {
    const { userId } = req.params;

    if (req.user?.id !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const applications = await Application.find({ userId })
      .sort({ createdAt: -1 })
      .populate({ path: "jobId", select: "title description location status" });

    return res.status(200).json({ applications });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
