import axios from "axios";
import Current from "../models/Current.js";

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

let lastFetchTime = 0;
let cachedData = null;
const CACHE_DURATION = 60 * 1000;

export const fetchTopCryptos = async (_, res) => {
  try {
    const now = Date.now();

    if (cachedData && now - lastFetchTime < CACHE_DURATION) {
      console.log("Serving from cache");
      return res.json({
        success: true,
        count: cachedData.length,
        data: cachedData,
        fromCache: true,
      });
    }

    const { data } = await axios.get(COINGECKO_URL);

    const formatted = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      lastUpdated: new Date(),
    }));

    await Current.deleteMany({});
    await Current.insertMany(formatted);

    lastFetchTime = now;
    cachedData = formatted;

    res.json({
      success: true,
      count: formatted.length,
      data: formatted,
      fromCache: false,
    });
  } catch (err) {
    console.error("Coin route error:", err.message);

    if (cachedData) {
      console.log("API error, serving stale cache");
      return res.status(206).json({
        success: true,
        count: cachedData.length,
        data: cachedData,
        fromCache: true,
        message: "Serving cached data due to API error",
      });
    }

    res.status(500).json({ success: false, message: err.message });
  }
};
