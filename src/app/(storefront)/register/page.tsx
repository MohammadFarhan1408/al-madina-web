import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterPage } from "@/features/auth/RegisterPage";

export const metadata: Metadata = { title: "Create Account" };

export default function Page() {
  return (
    <Suspense>
      <RegisterPage />
    </Suspense>
  );
}
