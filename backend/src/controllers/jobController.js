import Job from "../models/Job.js";
import User from "../models/User.js";

// Get all jobs with optional filtering and pagination
const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      jobType,
      jobSite,
      experienceLevel,
      sector,
      status = "OPEN",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (jobType) filter.jobType = jobType;
    if (jobSite) filter.jobSite = jobSite;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (sector) filter.sector = new RegExp(sector, 'i');

    // Build search query
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { skills: { $in: [new RegExp(search, 'i')] } },
        { sector: new RegExp(search, 'i') }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const jobs = await Job.find(filter)
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    return res.status(200).json({
      jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalJobs: total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate('createdBy', 'name email')
      .lean();

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.status(200).json({ job });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid job ID" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create new job
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      jobType,
      jobSite,
      location,
      skills,
      sector,
      experienceLevel,
      deadline
    } = req.body;

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      jobType,
      jobSite,
      location: {
        city: location.city.trim(),
        country: location.country.trim(),
      },
      skills: skills || [],
      sector: sector?.trim(),
      experienceLevel,
      deadline: new Date(deadline),
      createdBy: req.user.id,
    });

    const populatedJob = await Job.findById(job._id)
      .populate("createdBy", "name email")
      .lean();

    return res.status(201).json({  message: "Job created successfully" ,job: populatedJob,});
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body || {};

    // Find job and check ownership
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Validate deadline if provided
    if (updateData.deadline) {
      const deadlineDate = new Date(updateData.deadline);
      if (deadlineDate <= new Date()) {
        return res.status(400).json({
          error: "Deadline must be in the future"
        });
      }
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email').lean();

    return res.status(200).json({ message:"Job updated successfully",job: updatedJob });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid job ID" });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find job and check ownership
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Delete job
    await Job.findByIdAndDelete(id);

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid job ID" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get jobs created by specific user
const getJobsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Build filter
    const filter = { createdBy: userId };
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const jobs = await Job.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Job.countDocuments(filter);

    return res.status(200).json({
      jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalJobs: total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllJobs, getJobById, createJob, updateJob, deleteJob, getJobsByUser };