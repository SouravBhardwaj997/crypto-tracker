import axios from "axios";
const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

export const fetchTopCryptos = async (req, res) => {
  try {
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

    return res.json({
      success: true,
      source: "CoinGecko Live",
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.log("error in fetchTopCryptos", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
