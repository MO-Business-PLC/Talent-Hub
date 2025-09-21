import express from "express";
import { auth,authorize } from "../middleware/auth.js";
import { upload,checkResume} from "../utils/cloudinaryUpload.js";
import {
  uploadResume,
  getResume,
  deleteResume,
} from "../controllers/resumeController.js";

const router = express.Router();

// Upload resume (PDF/DOCX etc.)
router.post("/", auth, authorize("employee") ,checkResume,upload.single("resume"), uploadResume);

// Get current user's resume
router.get("/", auth, getResume);

// Delete resume
router.delete("/", auth, authorize("employee","admin"), deleteResume);

export default router;
