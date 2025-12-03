import express from "express";
import "dotenv/config";
import { connectDB } from "./utils/ConnectDb.js";
const app = express();
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  connectDB();
  console.log("Server is running at PORT:", PORT);
});
