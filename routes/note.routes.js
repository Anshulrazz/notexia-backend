import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  createNote,
  getNotes,
  getNoteById,
  toggleLike,
  addComment,
  incrementDownload,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

const router = express.Router();

// ==============================
// NOTES / PROJECTS ROUTES
// ==============================

// Upload note or project
// field name must be: note OR project
router.post(
  "/",
  authMiddleware,
  upload.single("note"),
  createNote
);

// Get all notes
router.get("/", getNotes);

// Get note by ID
router.get("/:id", getNoteById);

// Like / Unlike
router.post("/:id/like", authMiddleware, toggleLike);

// Comment
router.post("/:id/comment", authMiddleware, addComment);

// Download count
router.post("/:id/download", incrementDownload);

// Update note
router.put("/:id", authMiddleware, updateNote);

// Delete note
router.delete("/:id", authMiddleware, deleteNote);

export default router;
  