import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/features/auth/ForgotPasswordPage";

export const metadata: Metadata = { title: "Reset Password" };

export default function Page() {
  return <ForgotPasswordPage />;
}
