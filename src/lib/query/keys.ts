// Centralized TanStack Query keys (mirrors mobile's query-keys convention).
export const queryKeys = {
  auth: ["auth", "me"] as const,

  products: (params?: unknown) => ["products", params ?? {}] as const,
  product: (id: string) => ["product", id] as const,
  productsByIds: (ids: string[]) => ["products", "by-ids", [...ids].sort()] as const,
  productReviews: (id: string) => ["product", id, "reviews"] as const,
  rail: (kind: string) => ["products", "rail", kind] as const,
  search: (q: string) => ["search", q] as const,
  suggest: (q: string) => ["suggest", q] as const,
  trending: ["search", "trending"] as const,

  categories: ["categories"] as const,
  category: (id: string) => ["category", id] as const,
  categoryProducts: (id: string) => ["category", id, "products"] as const,

  collections: ["collections"] as const,
  collection: (id: string) => ["collection", id] as const,
  collectionProducts: (id: string) => ["collection", id, "products"] as const,

  cart: ["cart"] as const,
  wishlist: ["wishlist"] as const,

  orders: (params?: unknown) => ["orders", params ?? {}] as const,
  order: (id: string) => ["order", id] as const,
  orderPayments: (id: string) => ["order", id, "payments"] as const,

  addresses: ["addresses"] as const,
  notifications: ["notifications"] as const,
};
