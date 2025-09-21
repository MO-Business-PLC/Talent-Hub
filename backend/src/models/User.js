// backend/src/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["employee", "employer", "admin"],
      default: "employee",
    },
    resumeUrl: {
      type: String,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+\..+/.test(v),
        message: (props) => `${props.value} is not a valid URL`,
      },
    },
    profileImage: {
      type: String, // Cloudinary / S3 URL
      validate: {
        validator: (v) => !v || /^https?:\/\/.+\..+/.test(v),
        message: (props) => `${props.value} is not a valid URL`,
      },
    },
    professionalTitle: {
      type: String,
      trim: true,
      maxlength: [100, "Professional title cannot exceed 100 characters"],
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [100, "Industry cannot exceed 100 characters"],
    },
    experienceLevel: {
      type: String,
      enum: ["junior", "mid", "senior", "lead"],
    },
    phoneNumber: {
      type: String,
      match: [/^\+?[0-9]{7,15}$/, "Please enter a valid phone number"],
    },
    location: {
      city: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    professionalSummary: {
      type: String,
      maxlength: [2000, "Professional summary cannot exceed 2000 characters"],
    },
    linkedInUrl: {
      type: String,
      validate: {
        validator: (v) => !v || /^https?:\/\/(www\.)?linkedin\.com\/.+$/.test(v),
        message: (props) => `${props.value} is not a valid LinkedIn URL`,
      },
    },
    githubUrl: {
      type: String,
      validate: {
        validator: (v) => !v || /^https?:\/\/(www\.)?github\.com\/.+$/.test(v),
        message: (props) => `${props.value} is not a valid GitHub URL`,
      },
    },
    portfolioUrl: {
      type: String,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+\..+/.test(v),
        message: (props) => `${props.value} is not a valid portfolio URL`,
      },
    },
  },
  { timestamps: true }
);

// Unique index for email
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive fields when converting to JSON
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;
