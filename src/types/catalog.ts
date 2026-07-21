/**
 * Catalog types mirror the al-madina-api response contracts so a later
 * `lib/api.ts` + TanStack Query layer can drop in without reshaping data.
 * Homepage (Phase 1) feeds these from static mock content.
 */

export type ScentFamily =
  | "oud"
  | "floral"
  | "amber"
  | "musk"
  | "woody"
  | "citrus"
  | "spicy";

export type ProductBadge = "new" | "bestseller" | "limited" | "exclusive";

export type CollectionAccent = "gold" | "emerald" | "burgundy";

export interface ProductVariant {
  volumeMl: number;
  price: number;
  sku: string;
  stock: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  brand: string;
  categoryId: string;
  description: string;
  notes: string[];
  scentFamily: ScentFamily;
  volumeMl: number;
  price: number; // integer AED, no decimals
  originalPrice?: number;
  currency: "AED";
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean; // boolean only — no inventory quantity in the system
  badge?: ProductBadge;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isSignature: boolean;
  isSeasonal: boolean;
  variants: ProductVariant[];
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface Category {
  id: string;
  name: string;
  tagline?: string;
  image: string;
  productCount: number;
  sortOrder: number;
  slug?: string;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  accent: CollectionAccent;
  productIds: string[];
  productCount: number;
  sortOrder: number;
  slug?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

/** AED prices are always integers — format without decimals. */
export const formatAED = (n: number) => `AED ${n.toLocaleString("en-AE")}`;
