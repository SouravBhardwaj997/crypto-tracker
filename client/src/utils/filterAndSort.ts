import type { Crypto, SortBy, SortOrder, FilterState } from "../types/index";

export const filterCryptos = (
  cryptos: Crypto[],
  filterState: FilterState
): Crypto[] => {
  const { searchTerm, priceRange, sortBy, sortOrder } = filterState;

  const filtered = cryptos.filter((crypto) => {
    const matchesSearch =
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase());

    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPrice = crypto.price >= minPrice && crypto.price <= maxPrice;

    return matchesSearch && matchesPrice;
  });

  return sortCryptos(filtered, sortBy, sortOrder);
};

export const sortCryptos = (
  cryptos: Crypto[],
  sortBy: SortBy,
  sortOrder: SortOrder
): Crypto[] => {
  const sorted = [...cryptos];

  sorted.sort((a, b) => {
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

  return sorted;
};
