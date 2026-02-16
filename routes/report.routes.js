import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
} from "../controllers/report.controller.js";

const router = express.Router();

// ==============================
// REPORT ROUTES
// ==============================

// User creates report
router.post("/", authMiddleware, createReport);

// Admin views reports
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getReports
);

// Get report by ID (ADMIN)
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getReportById
);

// Admin updates status
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  updateReportStatus
);

export default router;
