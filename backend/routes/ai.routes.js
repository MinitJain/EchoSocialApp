import express from "express";
import { chatWithAI } from "../controllers/ai.controller.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();
router.post("/chat", isAuthenticated, chatWithAI);

export default router;
