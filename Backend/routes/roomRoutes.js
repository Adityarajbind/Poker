import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createRoom,
  joinRoom,
  getRoom,
  leaveRoom,
  toggleReady,
  addBot,
  startRoom,
} from "../controllers/roomController.js";

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.post("/join", authMiddleware, joinRoom);

router.get("/:code", authMiddleware, getRoom);

router.post("/leave", authMiddleware, leaveRoom);
router.post("/ready", authMiddleware, toggleReady);
router.post("/addBot", authMiddleware, addBot);
router.post("/start", authMiddleware, startRoom);

export default router;