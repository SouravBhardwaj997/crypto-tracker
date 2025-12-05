import { Schema, model } from "mongoose";

const currentSchema = new Schema(
  {
    coinId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    change24h: { type: Number, required: true },
  },
  { timestamps: true }
);

currentSchema.index({ symbol: 1 });
currentSchema.index({ price: 1 });
currentSchema.index({ marketCap: 1 });

export default model("Current", currentSchema);
