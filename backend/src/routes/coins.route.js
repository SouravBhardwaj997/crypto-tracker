import { Router } from "express";
import { fetchTopCryptos } from "../controllers/coins.controller.js";

const router = Router();

router.get("/", fetchTopCryptos);
export default router;
