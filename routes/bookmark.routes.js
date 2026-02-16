import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  checkBookmark,
} from "../controllers/bookmark.controller.js";

const router = express.Router();

// ==============================
// BOOKMARK ROUTES (All require authentication)
// ==============================

// Get all bookmarks
router.get("/", authMiddleware, getBookmarks);

// Add bookmark
router.post("/", authMiddleware, addBookmark);

// Remove bookmark
router.delete("/:id", authMiddleware, removeBookmark);

// Check bookmark status
router.get("/check/:itemType/:itemId", authMiddleware, checkBookmark);

export default router;
