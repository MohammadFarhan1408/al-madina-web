import type { Metadata } from "next";
import { AboutPage } from "@/features/content/AboutPage";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The heritage and craft behind Al Madina Ittar — a Maison of Arabian perfumery.",
};

export default function Page() {
  return <AboutPage />;
}
