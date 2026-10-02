import type { Metadata } from "next";
import { CategoriesPage } from "@/features/catalog/CategoriesPage";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse Al Madina Ittar by category — oud perfumes, pure and premium attars, and more.",
};

export default function Page() {
  return <CategoriesPage />;
}
