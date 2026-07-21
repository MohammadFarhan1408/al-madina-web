import type { Metadata } from "next";
import { CollectionsPage } from "@/features/collections/CollectionsPage";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Curated Al Madina Ittar fragrance collections — drawn by mood, season and hour.",
};

export default function Page() {
  return <CollectionsPage />;
}
