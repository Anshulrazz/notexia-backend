import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import {
  getStats,
  getUsers,
  changeUserRole,
  toggleBanUser,
  recalculateUserStats,
} from "../controllers/admin.controller.js";

const router = express.Router();

// ==============================
// ADMIN ROUTES
// ==============================

// Dashboard stats
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("admin"),
  getStats
);

// Get all users
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  getUsers
);

// Change user role
router.put(
  "/users/:id/role",
  authMiddleware,
  roleMiddleware("admin"),
  changeUserRole
);

// Ban / Unban user
router.put(
  "/users/:id/ban",
  authMiddleware,
  roleMiddleware("admin"),
  toggleBanUser
);

// Recalculate user stats
router.post(
  "/recalculate-stats",
  authMiddleware,
  roleMiddleware("admin"),
  recalculateUserStats
);

export default router;
