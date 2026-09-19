export interface ParsedQuery {
  search_keywords: string;
  min_price: number | null;
  max_price: number | null;
  notes: string;
  category: string;
}

export interface ProductResult {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  url: string;
  image_url: string;
  price_score: number;
  trust_score: number;
  overall_score: number;
  source: string;
}

export interface SearchResponse {
  query: string;
  parsed: ParsedQuery;
  products: ProductResult[];
  recommendation: string;
}
