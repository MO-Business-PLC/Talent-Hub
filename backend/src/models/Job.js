// backend/src/models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minlength: [3, "Job title must be at least 3 characters long"],
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      minlength: [20, "Job description must be at least 20 characters"],
    },
    jobType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"],
      default: "FULL_TIME",
    },
    jobSite: {
      type: String,
      enum: ["ONSITE", "REMOTE", "HYBRID"],
      default: "ONSITE",
    },
    location: {
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
    },
    skills: {
      type: [String],
    },
    sector: {
      type: String,
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ["JUNIOR", "MID", "SENIOR"],
      default: "MID",
    },
    deadline: {
      type: Date,
      required: [true, "Application deadline is required"],
      validate: {
        validator: function (date) {
          return date > new Date();
        },
        message: "Deadline must be in the future",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Job must have a creator"],
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

// Index for faster job searches
jobSchema.index({ title: "text", description: "text", skills: 1, sector: 1 });

const Job = mongoose.model("Job", jobSchema);
export default Job;
