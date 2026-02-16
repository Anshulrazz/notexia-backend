import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createForum,
  getForums,
  getForumById,
  joinForum,
  createThread,
  getThread,
  deleteForum,
} from "../controllers/forum.controller.js";

const router = express.Router();

// ==============================
// FORUM ROUTES
// ==============================

// Create forum
router.post("/", authMiddleware, createForum);

// Get all forums
router.get("/", getForums);

// Get forum by ID
router.get("/:id", getForumById);

// Join forum
router.post("/:id/join", authMiddleware, joinForum);

// Create thread
router.post("/:id/thread", authMiddleware, createThread);

// Get thread by ID
router.get("/:forumId/thread/:threadId", getThread);

// Delete forum
router.delete("/:id", authMiddleware, deleteForum);

export default router;

