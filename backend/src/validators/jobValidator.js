// backend/src/validators/jobValidator.js
import { body } from "express-validator";

export const createJobValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Job title is required")
    .isLength({ min: 3 }).withMessage("Job title must be at least 3 characters long")
    .isLength({ max: 100 }).withMessage("Job title cannot exceed 100 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Job description is required")
    .isLength({ min: 20 }).withMessage("Job description must be at least 20 characters"),

  body("jobType")
    .optional()
    .isIn(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"])
    .withMessage("Invalid job type"),

  body("jobSite")
    .optional()
    .isIn(["ONSITE", "REMOTE", "HYBRID"])
    .withMessage("Invalid job site"),

  body("location.city")
    .trim()
    .notEmpty().withMessage("City is required"),

  body("location.country")
    .trim()
    .notEmpty().withMessage("Country is required"),

  body("skills")
    .optional()
    .isArray().withMessage("Skills must be an array of strings"),

  body("sector")
    .optional()
    .trim(),

  body("experienceLevel")
    .optional()
    .isIn(["JUNIOR", "MID", "SENIOR"])
    .withMessage("Invalid experience level"),

  body("deadline")
    .notEmpty().withMessage("Deadline is required")
    .isISO8601().withMessage("Deadline must be a valid date")
    .custom((value) => {
      const date = new Date(value);
      if (date <= new Date()) {
        throw new Error("Deadline must be in the future");
      }
      return true;
    }),
];
