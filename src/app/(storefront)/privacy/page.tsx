import type { Metadata } from "next";
import { PrivacyPage } from "@/features/content/PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Al Madina Ittar collects, uses and protects your information.",
};

export default function Page() {
  return <PrivacyPage />;
}
