import { body } from "express-validator";

export const applyValidator = [
  body("jobId")
    .notEmpty().withMessage("Job ID is required")
    .isMongoId().withMessage("Invalid Job ID"),
  body("resumeUrl")
    .notEmpty().withMessage("Resume URL is required")
    .isURL().withMessage("Resume URL must be a valid URL"),
  body("coverLetter")
    .optional()
    .isLength({ max: 2000 }).withMessage("Cover letter cannot exceed 2000 characters"),
];

