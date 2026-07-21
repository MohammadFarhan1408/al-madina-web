import type { Metadata } from "next";
import { FaqPage } from "@/features/content/FaqPage";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about shipping, returns, orders and payment.",
};

export default function Page() {
  return <FaqPage />;
}
