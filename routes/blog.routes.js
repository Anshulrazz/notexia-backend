import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createBlog,
  getBlogs,
  getBlog,
  toggleLikeBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

// ==============================
// BLOG ROUTES
// ==============================

// Create blog
router.post("/", authMiddleware, createBlog);

// Get all blogs
router.get("/", getBlogs);

// Get single blog
router.get("/:id", getBlog);

// Like / Unlike blog
router.post("/:id/like", authMiddleware, toggleLikeBlog);

// Update blog
router.put("/:id", authMiddleware, updateBlog);

// Delete blog
router.delete("/:id", authMiddleware, deleteBlog);

export default router;
