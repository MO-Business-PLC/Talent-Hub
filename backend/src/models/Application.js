import mongoose from "mongoose";

const { Schema } = mongoose;

const applicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    resume: {
      url: {
        type: String,
        required: [true, "Resume URL is required"],
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+\..+/.test(v); // basic URL check
          },
          message: (props) => `${props.value} is not a valid URL`,
        },
      },
      publicId: {
        type: String,
        required: [true, "Cloudinary publicId is required"],
      },
      originalName: {
    type: String,
    trim: true,
  },
      format: {
        type: String,
      },
    },
    coverLetter: {
      type: String,
      maxlength: [2000, "Cover letter cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["applied", "shortlisted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      default: "applied",
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications (same user applying to same job)
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

// Error handling middleware for duplicate key (E11000)
applicationSchema.post("save", function (error, doc, next) {
  next(error);
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
