import type { Metadata } from "next";
import { ShippingReturnsPage } from "@/features/content/ShippingReturnsPage";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Delivery times, fees and our return policy at Al Madina Ittar.",
};

export default function Page() {
  return <ShippingReturnsPage />;
}
