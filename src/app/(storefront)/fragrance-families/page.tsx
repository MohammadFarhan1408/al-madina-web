import type { Metadata } from "next";
import { FamiliesPage } from "@/features/families/FamiliesPage";

export const metadata: Metadata = {
  title: "Fragrance Families",
  description:
    "Explore Al Madina Ittar by scent family — oud, amber, floral, musk, woody, spicy and citrus.",
};

export default function Page() {
  return <FamiliesPage />;
}
