import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Multer - keep files in memory
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//upload to cloudinary
export const uploadToCloudinary = (fileBuffer, folder = "resumes") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw", // for PDFs/DOCs
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
          });
        }
      }
    );

    if (!fileBuffer) return reject(new Error("No file buffer provided"));
    stream.end(fileBuffer);
  });
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
};



export const checkResume = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.resume?.url) {
      // Delete previous resume from Cloudinary
      if (user.resume.public_id) {
        await cloudinary.uploader.destroy(user.resume.public_id, { resource_type: "raw" });
      }
      // Clear resume info
      user.resume = null;
      await user.save();
      console.log("delete unecessary")
    }

    next();
  } catch (error) {
    console.error("Error in checkAvailability:", error);
    res.status(500).json({ error: "Failed to check existing resume" });
  }
};
