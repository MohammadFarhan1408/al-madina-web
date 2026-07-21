import type { Metadata } from "next";
import { WishlistPage } from "@/features/wishlist/WishlistPage";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved Al Madina Ittar fragrances.",
};

export default function Page() {
  return <WishlistPage />;
}
