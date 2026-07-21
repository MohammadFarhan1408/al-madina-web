import type { Metadata } from "next";
import { CartPage } from "@/features/cart/CartPage";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Review your Al Madina Ittar selections before checkout.",
};

export default function Page() {
  return <CartPage />;
}
