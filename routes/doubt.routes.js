import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createDoubt,
  getDoubts,
  getDoubtById,
  answerDoubt,
  upvoteAnswer,
  acceptAnswer,
  deleteDoubt,
} from "../controllers/doubt.controller.js";

const router = express.Router();

// ==============================
// DOUBT ROUTES
// ==============================

// Create doubt
router.post("/", authMiddleware, createDoubt);

// Get all doubts
router.get("/", getDoubts);

// Get doubt by ID
router.get("/:id", getDoubtById);

// Answer a doubt
router.post("/:id/answer", authMiddleware, answerDoubt);

// Upvote an answer
router.post(
  "/:doubtId/answer/:answerId/upvote",
  authMiddleware,
  upvoteAnswer
);

// Accept an answer
router.post(
  "/:doubtId/accept/:answerId",
  authMiddleware,
  acceptAnswer
);

// Delete doubt
router.delete("/:id", authMiddleware, deleteDoubt);

export default router;
