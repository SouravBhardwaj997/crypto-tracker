import { useEffect, useState } from "react";

interface Crypto {
  _id?: string;
  coinId: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number | null;
  change24h: number | null;
  lastUpdated: string;
}

type SortBy = "price" | "marketCap" | "change24h" | "name";
type SortOrder = "asc" | "desc";

function App() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState<SortBy>("marketCap");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/coins`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setCryptos(data.data);
        setLastUpdated(new Date().toLocaleString());
      } else {
        setError("Failed to fetch cryptocurrency data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();

    const refreshInterval = setInterval(() => {
      fetchCryptos();
    }, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const filtered = cryptos.filter((crypto) => {
      const matchesSearch =
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase());

      const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      const matchesPrice = crypto.price >= minPrice && crypto.price <= maxPrice;

      return matchesSearch && matchesPrice;
    });

    filtered.sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "marketCap":
          aValue = a.marketCap || 0;
          bValue = b.marketCap || 0;
          break;
        case "change24h":
          aValue = a.change24h || 0;
          bValue = b.change24h || 0;
          break;
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sortOrder === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    setFilteredCryptos(filtered);
  }, [cryptos, searchTerm, priceRange, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-lg font-semibold text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-lg font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <header className="mb-8 text-center pb-8 border-b-2 border-gray-800">
          <h1 className="text-5xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-3">
            Crypto Tracker
          </h1>
          <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>
        </header>

        <div className="mb-8 space-y-4 bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Search by Name or Symbol
              </label>
              <input
                type="text"
                placeholder="Bitcoin, ETH..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Min Price ($)
              </label>
              <input
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Max Price ($)
              </label>
              <input
                type="number"
                placeholder="∞"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="marketCap">Market Cap</option>
                  <option value="price">Price</option>
                  <option value="change24h">24h Change</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={fetchCryptos}
            disabled={loading}
            className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-medium transition-colors"
          >
            {loading ? "Refreshing..." : "Refresh Now"}
          </button>
        </div>

        {filteredCryptos.length === 0 ? (
          <div className="flex items-center justify-center min-h-96 text-gray-500">
            {cryptos.length === 0
              ? "No cryptocurrency data available"
              : "No cryptocurrencies match your filters"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCryptos.map((crypto) => (
              <div
                key={crypto.coinId}
                className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-700">
                  <h2 className="text-xl font-semibold text-white">
                    {crypto.name}
                  </h2>
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {crypto.symbol.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase text-gray-500 tracking-wider block mb-1">
                      Price
                    </label>
                    <p className="text-2xl font-bold text-blue-400">
                      $
                      {crypto.price?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs uppercase text-gray-500 tracking-wider block mb-1">
                      Market Cap
                    </label>
                    <p className="text-2xl font-bold text-purple-400">
                      {crypto.marketCap
                        ? "$" +
                          (crypto.marketCap / 1e9).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) +
                          "B"
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs uppercase text-gray-500 tracking-wider block mb-1">
                      24h Change
                    </label>
                    <p
                      className={`text-xl font-bold ${
                        crypto.change24h !== null && crypto.change24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {crypto.change24h !== null
                        ? crypto.change24h.toFixed(2) + "%"
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
