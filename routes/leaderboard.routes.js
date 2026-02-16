import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getLeaderboard,
  getMyRank,
} from "../controllers/leaderboard.controller.js";

const router = express.Router();

// ==============================
// LEADERBOARD ROUTES (All require authentication)
// ==============================

// Get leaderboard
router.get("/", authMiddleware, getLeaderboard);

// Get my rank
router.get("/me", authMiddleware, getMyRank);

export default router;
