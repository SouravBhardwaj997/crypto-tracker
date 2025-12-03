import express from "express";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log("Server is running at PORT:", PORT);
});
