import express from "express";
import { register, login, getMe, googleLogin } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// ==============================
// AUTH ROUTES
// ==============================

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get logged-in user
router.get("/me", authMiddleware, getMe);
router.post("/google-login", googleLogin);
router.post("/google", googleLogin);

export default router;
