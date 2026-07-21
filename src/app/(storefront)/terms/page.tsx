import type { Metadata } from "next";
import { TermsPage } from "@/features/content/TermsPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Al Madina Ittar.",
};

export default function Page() {
  return <TermsPage />;
}
