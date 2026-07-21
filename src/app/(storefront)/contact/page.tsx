import type { Metadata } from "next";
import { ContactPage } from "@/features/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Al Madina Ittar for enquiries, commissions or order support.",
};

export default function Page() {
  return <ContactPage />;
}
