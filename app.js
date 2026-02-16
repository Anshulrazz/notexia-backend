import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// Middlewares
import errorMiddleware from "./middlewares/error.middleware.js";

// Routes (we’ll create these files later)
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import noteRoutes from "./routes/note.routes.js";
import doubtRoutes from "./routes/doubt.routes.js";
import forumRoutes from "./routes/forum.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import reportRoutes from "./routes/report.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import schemaRoutes from "./routes/schema.routes.js";


const app = express();

// Required for ES Modules (__dirname fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================
// GLOBAL MIDDLEWARES
// =======================
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

// Security headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3000/",
  "https://notexia.in/",
  "https://notexia.in",
  "https://www.notexia.in/",
  "https://www.notexia.in"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// =======================
// RATE LIMITING
// =======================
const rateLimitWindowMinutes = Number.parseInt(process.env.RATE_LIMIT_WINDOW ?? "", 10);
const rateLimitMax = Number.parseInt(process.env.RATE_LIMIT_MAX ?? "", 10);

const limiter = rateLimit({
  windowMs: Number.isFinite(rateLimitWindowMinutes)
    ? rateLimitWindowMinutes * 60 * 1000
    : 15 * 60 * 1000,
  max: Number.isFinite(rateLimitMax) ? rateLimitMax : 1000,
  message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

// =======================
// STATIC FILE SERVING (VPS UPLOADS)
// =======================
const staticUploads = express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
  },
});

app.use(
  "/uploads",
  staticUploads
);
app.use("/api/uploads", staticUploads);

// =======================
// ROUTES
// =======================
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Notexia API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/forums", forumRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/schemas", schemaRoutes);


 

// =======================
// ERROR HANDLER (LAST)
// =======================
app.use(errorMiddleware);

export default app; 
