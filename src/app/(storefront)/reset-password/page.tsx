import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordPage } from "@/features/auth/ResetPasswordPage";

export const metadata: Metadata = { title: "Set a New Password" };

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
