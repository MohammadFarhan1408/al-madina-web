// Typed API path constants — the single place mapping to backend routes.
// Do NOT introduce paths that don't exist in al-madina-api/src/modules/*.

export const endpoints = {
  auth: {
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
    refresh: "/auth/refresh",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  products: {
    list: "/products",
    search: "/products/search",
    suggest: "/products/suggest",
    featured: "/products/featured",
    newArrivals: "/products/new-arrivals",
    bestSellers: "/products/best-sellers",
    signature: "/products/signature",
    seasonal: "/products/seasonal",
    detail: (id: string) => `/products/${id}`,
    reviews: (id: string) => `/products/${id}/reviews`,
  },
  categories: {
    list: "/categories",
    detail: (id: string) => `/categories/${id}`,
    products: (id: string) => `/categories/${id}/products`,
  },
  collections: {
    list: "/collections",
    detail: (id: string) => `/collections/${id}`,
    products: (id: string) => `/collections/${id}/products`,
  },
  search: {
    trending: "/search/trending",
  },
  cart: {
    get: "/cart",
    sync: "/cart/sync",
    items: "/cart/items",
    item: (productId: string) => `/cart/items/${productId}`,
  },
  wishlist: {
    get: "/wishlist",
    add: "/wishlist",
    remove: (productId: string) => `/wishlist/${productId}`,
  },
  coupons: {
    validate: "/coupons/validate",
  },
  orders: {
    list: "/orders",
    create: "/orders",
    detail: (id: string) => `/orders/${id}`,
    payments: (id: string) => `/orders/${id}/payments`,
    retryPayment: (id: string) => `/orders/${id}/payments/retry`,
  },
  addresses: {
    list: "/addresses",
    create: "/addresses",
    item: (id: string) => `/addresses/${id}`,
  },
  notifications: {
    list: "/notifications",
    readAll: "/notifications/read-all",
    read: (id: string) => `/notifications/${id}/read`,
  },
  users: {
    me: "/users/me",
    preferences: "/users/me/preferences",
  },
  contact: "/contact",
} as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/v1";
