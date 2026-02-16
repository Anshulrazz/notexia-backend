import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getDoubtHint,
  getTags,
  getBlogSummary,
  getAIDoubtAnswer,
} from "../controllers/ai.controller.js";

const router = express.Router();

// ==============================
// AI ROUTES
// ==============================

router.post("/doubt-hint", authMiddleware, getDoubtHint);
router.post("/doubt-answer", authMiddleware, getAIDoubtAnswer);
router.post("/tags", authMiddleware, getTags);
router.post("/blog-summary", authMiddleware, getBlogSummary);

export default router;
