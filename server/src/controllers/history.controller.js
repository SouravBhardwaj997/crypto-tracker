import Current from "../models/Current.js";
import History from "../models/History.js";

const validateHistoryData = (data) => {
  const errors = [];

  if (Array.isArray(data)) {
    if (data.length === 0) {
      errors.push("History data array cannot be empty");
    }

    data.forEach((item, index) => {
      if (!item.coinId || typeof item.coinId !== "string") {
        errors.push(`Item ${index}: coinId is required and must be a string`);
      }
      if (!item.name || typeof item.name !== "string") {
        errors.push(`Item ${index}: name is required and must be a string`);
      }
      if (!item.symbol || typeof item.symbol !== "string") {
        errors.push(`Item ${index}: symbol is required and must be a string`);
      }
      if (typeof item.price !== "number" || item.price < 0) {
        errors.push(
          `Item ${index}: price is required and must be a non-negative number`
        );
      }
      if (item.marketCap !== null && item.marketCap !== undefined && (typeof item.marketCap !== "number" || item.marketCap < 0)) {
        errors.push(
          `Item ${index}: marketCap must be a non-negative number or null`
        );
      }
      if (item.change24h !== null && item.change24h !== undefined && typeof item.change24h !== "number") {
        errors.push(`Item ${index}: change24h must be a number or null`);
      }
    });
  } else {
    errors.push("Request body must be an array of cryptocurrency data");
  }

  return errors;
};

export const appendHistoryData = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
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

      return res.json({
        success: true,
        message: "History created from Current",
        inserted: historyDocs.length,
      });
    }

    const validationErrors = validateHistoryData(data);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const historyDocs = data.map((item) => ({
      coinId: item.coinId,
      name: item.name,
      symbol: item.symbol,
      price: item.price,
      marketCap: item.marketCap || null,
      change24h: item.change24h || null,
      snapshotAt: new Date(),
    }));

    await History.insertMany(historyDocs);

    res.json({
      success: true,
      message: "History data appended successfully",
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
