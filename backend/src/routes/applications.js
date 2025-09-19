import express from "express";
import { auth, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  getEmployerApplications,
  getApplicationsByJob,
  applyToJob,
  getUserApplications,
} from "../controllers/applicationController.js";
import { applyValidator } from "../validators/applicationValidator.js";
import { upload } from "../utils/cloudinaryUpload.js";

const router = express.Router();

router.get("/employer", auth, authorize("admin", "employer"), getEmployerApplications);
router.get("/job/:jobId", auth, authorize("admin", "employer"), getApplicationsByJob);
router.post(
  "/",
  auth,
  authorize("employee"),
  upload.single("resume"),
  applyValidator,
  validate,
  applyToJob
);
router.get("/:userId", auth, authorize("admin", "employee"), getUserApplications);

export default router;
