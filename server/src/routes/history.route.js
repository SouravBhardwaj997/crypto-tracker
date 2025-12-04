import { Router } from "express";
import {
  appendHistoryData,
  fetchSingleCoinData,
} from "../controllers/history.controller.js";
const router = Router();

router.post("/", appendHistoryData);
router.get("/:coinId", fetchSingleCoinData);
export default router;
