import "dotenv/config";

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";

const parsedPort = Number.parseInt(process.env.PORT ?? "", 10);
const PORT = Number.isFinite(parsedPort) ? parsedPort : 5001;

// Connect to MongoDB
connectDB();

// Create server
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Notexia Backend running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});
