import User from "../models/User.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

// POST /upload/resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
        message: "Please select a resume file to upload",
      });
    }

    // Upload to Cloudinary
    const { url, publicId, format } = await uploadToCloudinary(
      req.file.buffer,
      "resumes"
    );

    // Update user with resume details
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        resume: {
          url,
          publicId,
          originalName: req.file.originalname,
          format,
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Resume uploaded successfully",
      data: user.resume,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Upload failed",
      message: error.message,
    });
  }
};

// GET /upload/resume
export const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("resume");

    if (!user || !user.resume?.url) {
      return res.status(404).json({
        error: "Resume not found",
        message: "This user has not uploaded a resume",
      });
    }

    res.status(200).json({
      data: user.resume,
    });
  } catch (error) {
    res.status(500).json({
      error: "Fetch failed",
      message: error.message,
    });
  }
};

// DELETE /upload/resume
export const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.resume?.publicId) {
      return res.status(404).json({
        error: "Resume not found",
        message: "This user has no uploaded resume",
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(user.resume.publicId);

    // Remove from DB
    user.resume = undefined;
    await user.save();

    res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      error: "Delete failed",
      message: error.message,
    });
  }
};
