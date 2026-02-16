import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  getUserById,
  getMyProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  getStats,
} from "../controllers/user.controller.js";

const router = express.Router();

// ==============================
// USER ROUTES
// ==============================

// Get my profile
router.get("/me", authMiddleware, getMyProfile);

// Update profile
router.put("/me", authMiddleware, updateProfile);

// Upload avatar
router.put(
  "/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);

// Change password
router.put("/me/password", authMiddleware, changePassword);

// Get user stats
router.get("/me/stats", authMiddleware, getStats);

// Get user by ID
router.get("/:id", getUserById);

export default router;
