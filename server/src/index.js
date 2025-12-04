import express from "express";
import "dotenv/config";
import { connectDB } from "./utils/ConnectDb.js";
import coinsRouter from "./routes/coins.route.js";
import historyRouter from "./routes/history.route.js";
const app = express();
const PORT = process.env.PORT || 8001;

app.use("/api/coins", coinsRouter);
app.use("/api/history", historyRouter);
app.listen(PORT, () => {
  connectDB();
  console.log("Server is running at PORT:", PORT);
});
