import { Schema, model } from "mongoose";

const historySchema = new Schema({
  coinId: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  marketCap: { type: Number, required: true },
  change24h: { type: Number, required: true },
  snapshotAt: { type: Date, default: Date.now },
});

export default model("History", historySchema);
