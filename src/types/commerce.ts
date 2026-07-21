// Commerce types mirroring al-madina-api response contracts (orders, cart,
// user, address, notification, coupon). Catalog types live in ./catalog.

export type Role = "user" | "manager" | "admin";
export type LoyaltyTier = "Member" | "Connoisseur" | "Maison Elite";

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: Role;
  tier: LoyaltyTier;
  memberSince?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ---- Cart (server-reconciled shape from GET /cart) ----
export interface ReconciledCartItem {
  productId: string;
  quantity: number;
  volumeMl?: number;
  price: number;
  name: string;
  image?: string;
}
export interface ReconciledCart {
  items: ReconciledCartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

/** A single line the client sends to /cart or /orders. */
export interface CartLineInput {
  productId: string;
  quantity: number;
  volumeMl?: number;
}

// ---- Coupons ----
export interface CouponPreview {
  valid: boolean;
  discountAmount: number;
  coupon: { code: string; discountType: "percentage" | "fixed"; value: number };
}

// ---- Orders ----
export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";
export type DeliveryMethod = "standard" | "express";
export type PaymentMethod = "card" | "wallet" | "cod";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export interface OrderLineItem {
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  volumeMl?: number;
}

export interface Order {
  id: string;
  reference: string;
  userId?: string | null;
  guestEmail?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  items: OrderLineItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: "AED";
  couponCode?: string;
  discountAmount: number;
  placedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

export interface Transaction {
  id: string;
  orderId: string;
  provider: "cod" | "simulated";
  status: TransactionStatus;
  amount: number;
  currency: "AED";
  providerReference?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  items: CartLineInput[];
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  guestEmail?: string;
  couponCode?: string;
  idempotencyKey: string;
}

// ---- Addresses ----
export interface Address {
  id: string;
  userId: string;
  label?: string;
  fullName: string;
  phone: string;
  addressLine: string;
  country: string;
  state?: string;
  city: string;
  postalCode?: string;
  landmark?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AddressInput = Omit<
  Address,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

// ---- Notifications ----
export interface Notification {
  id: string;
  userId: string;
  kind: "order" | "promo" | "system" | "wishlist";
  title: string;
  body: string;
  read: boolean;
  date: string;
  metadata?: Record<string, unknown>;
}
