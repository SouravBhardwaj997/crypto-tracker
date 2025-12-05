import express from "express";
import "dotenv/config";
import { connectDB } from "./utils/ConnectDb.js";
import coinsRouter from "./routes/coins.route.js";
import historyRouter from "./routes/history.route.js";
import { startHistoryCron } from "./crons/historyCron.js";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "*",
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", apiLimiter);
app.use("/api/coins", coinsRouter);
app.use("/api/history", historyRouter);

app.listen(PORT, () => {
  connectDB();
  startHistoryCron();
  console.log("Server is running at PORT:", PORT);
});
