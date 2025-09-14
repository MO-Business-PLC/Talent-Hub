// server.js
require("dotenv").config(); // Load env variables first

const app = require("./app");
const connectDB = require("./db/connectDB");

const PORT = process.env.PORT || 5000;

// Connect to DB before starting server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully`);
    server.close(() => {
      console.log("Process terminated");
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
});
