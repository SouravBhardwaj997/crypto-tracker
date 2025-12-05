export interface Crypto {
  _id?: string;
  coinId: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number | null;
  change24h: number | null;
  lastUpdated: string;
}

export type SortBy = "price" | "marketCap" | "change24h" | "name";
export type SortOrder = "asc" | "desc";

export interface PriceRange {
  min: string;
  max: string;
}

export interface FilterState {
  searchTerm: string;
  priceRange: PriceRange;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
