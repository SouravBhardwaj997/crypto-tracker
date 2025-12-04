import cron from "node-cron";
import axios from "axios";
import History from "../models/History.js";

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

export const startHistoryCron = () => {
  // Runs every hour (at minute 0)
  console.log("Cron Started");

  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Cron Running: Fetching Crypto History");

      const { data } = await axios.get(COINGECKO_URL);

      const historyDocs = data.map((coin) => ({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.current_price,
        marketCap: coin.market_cap,
        change24h: coin.price_change_percentage_24h,
        snapshotAt: new Date(),
      }));

      await History.insertMany(historyDocs);

      console.log(`Cron Success: ${historyDocs.length} rows inserted`);
    } catch (error) {
      console.error("Cron Failed:", error.message);
    }
  });
};
