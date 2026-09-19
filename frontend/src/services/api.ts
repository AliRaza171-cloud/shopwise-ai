import axios from "axios";
import type { TokenResponse, SignupPayload, LoginPayload } from "@/types/auth";
import type { SearchResponse, ProductResult } from "@/types/search";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sahi_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function signup(payload: SignupPayload): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>("/auth/signup", payload);
  return res.data;
}

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>("/auth/login", payload);
  return res.data;
}

export async function loginWithGoogle(idToken: string): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>("/auth/google", { id_token: idToken });
  return res.data;
}

export async function fetchCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function updateProfile(payload: { name?: string; email?: string }) {
  const res = await api.patch("/users/me", payload);
  return res.data;
}

export async function runSearch(query: string): Promise<SearchResponse> {
  const res = await api.post<SearchResponse>("/search", { query });
  return res.data;
}

export async function runCompare(products: ProductResult[]): Promise<{ summary: string }> {
  const payload = products.map((p) => ({
    name: p.name,
    price: p.price,
    rating: p.rating,
    reviews: p.reviews,
    url: p.url,
    trust_score: p.trust_score,
  }));
  const res = await api.post<{ summary: string }>("/compare", { products: payload });
  return res.data;
}

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  url: string;
  image_url: string;
  created_at: string;
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const res = await api.get<WishlistItem[]>("/wishlist");
  return res.data;
}

export async function addToWishlist(product: ProductResult): Promise<WishlistItem> {
  const res = await api.post<WishlistItem>("/wishlist", {
    name: product.name,
    price: product.price,
    rating: product.rating,
    reviews: product.reviews,
    url: product.url,
    image_url: product.image_url,
  });
  return res.data;
}

export async function removeFromWishlist(id: number): Promise<void> {
  await api.delete(`/wishlist/${id}`);
}

export interface SearchHistoryItem {
  id: number;
  query: string;
  search_keywords: string;
  min_price: number | null;
  max_price: number | null;
  result_count: number;
  created_at: string;
}

export async function getHistory(): Promise<SearchHistoryItem[]> {
  const res = await api.get<SearchHistoryItem[]>("/history");
  return res.data;
}

export default api;
