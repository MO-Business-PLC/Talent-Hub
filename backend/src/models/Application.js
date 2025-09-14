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
    resumeUrl: {
      type: String,
      required: [true, "Resume URL is required"],
      validate: {
        validator: function (v) {
          // basic URL validation
          return /^https?:\/\/.+\..+/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL`,
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

// prevent duplicate applications (same user applying to same job)
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

// Error handling middleware for duplicate key (E11000)
applicationSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("This user has already applied for this job."));
  } else {
    next(error);
  }
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
