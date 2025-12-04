import Current from "../models/Current.js";
import History from "../models/History.js";
export const appendHistoryData = async (_, res) => {
  try {
    const currentCoins = await Current.find();

    if (!currentCoins.length) {
      return res.status(400).json({
        success: false,
        message: "Current collection is empty",
      });
    }

    const historyDocs = currentCoins.map((c) => ({
      coinId: c.coinId,
      name: c.name,
      symbol: c.symbol,
      price: c.price,
      marketCap: c.marketCap,
      change24h: c.change24h,
      snapshotAt: new Date(),
    }));
    await History.insertMany(historyDocs);

    res.json({
      success: true,
      message: "History created from Current",
      inserted: historyDocs.length,
    });
  } catch (err) {
    console.error("History route error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const fetchSingleCoinData = async (req, res) => {
  try {
    const history = await History.find({
      coinId: req.params.coinId,
    }).sort({ snapshotAt: 1 });

    if (!history.length) {
      return res.status(400).json({
        success: false,
        message: `No history found for coinId: ${req.params.coinId}`,
      });
    }

    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    console.error("History fetch error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
