import { body } from "express-validator";

export const applyValidator = [
  body("jobId")
    .notEmpty().withMessage("Job ID is required")
    .isMongoId().withMessage("Invalid Job ID"),
  body("coverLetter")
    .optional()
    .isLength({ max: 2000 }).withMessage("Cover letter cannot exceed 2000 characters"),
];
