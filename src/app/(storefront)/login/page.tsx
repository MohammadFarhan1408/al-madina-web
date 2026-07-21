import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginPage } from "@/features/auth/LoginPage";

export const metadata: Metadata = { title: "Sign In" };

export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
