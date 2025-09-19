import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRouter from "./routes/auth.js";
import applicationsRouter from "./routes/applications.js";
import jobsRouter from "./routes/jobs.js";
import adminRouter from "./routes/admin.js";
import trendsRouter from "./routes/trends.js";
import uploadRouter from "./routes/upload.js";

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const defaultAllowedOrigins = [
  "http://localhost:5173", // Vite default
  "http://127.0.0.1:5173",
  "http://localhost:3000", // Common React dev port
  "http://127.0.0.1:3000",
];

const envOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...envOrigins, ...defaultAllowedOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (like curl) with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: Origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 200, // Avoid 204 issues with some browsers/proxies
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static file serving for uploads
app.use('/uploads', express.static(process.env.UPLOAD_PATH || './uploads'));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/trends", trendsRouter);
app.use("/api/upload", uploadRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Talent Hub API is running",
    timestamp: new Date().toISOString(),
  });
});

// Basic API route
app.get("/api", (req, res) => {
  res.json({
    message: "Talent Hub API",
    version: "1.0.0",
    status: "Initialized successfully",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      jobs: "/api/jobs",
      applications: "/api/applications",
      admin: "/api/admin",
      trends: "/api/trends",
      upload: "/api/upload",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
