import express from "express";
import { getAllSchemas } from "../controllers/schema.controller.js";

const router = express.Router();

// ==============================
// GET ALL SCHEMAS
// ==============================
router.get("/", getAllSchemas);

export default router;
