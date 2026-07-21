"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "./AuthShell";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/primitives";
import { Spinner } from "@/components/ui/feedback";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api/types";

const schema = z.object({ password: z.string().min(6, "At least 6 characters") });
type Form = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Form) => {
    try {
      await authService.resetPassword({ token, password: values.password });
      setDone(true);
      setTimeout(() => router.replace("/login"), 1800);
    } catch (err) {
      setError("root", { message: getErrorMessage(err, "This reset link is invalid or expired.") });
    }
  };

  return (
    <AuthShell
      eyebrow="Password"
      title="Set a New Password"
      footer={
        <Link href="/login" className="text-antique-gold hover:underline">
          Back to sign in
        </Link>
      }
    >
      {!token ? (
        <p className="text-center font-ui text-sm text-stone">
          This reset link is invalid. Request a new one from the{" "}
          <Link href="/forgot-password" className="text-antique-gold hover:underline">
            forgot password
          </Link>{" "}
          page.
        </p>
      ) : done ? (
        <p className="border border-antique-gold/40 bg-antique-gold/5 px-5 py-4 text-center font-ui text-sm text-ivory/85">
          Your password has been reset. Redirecting you to sign in…
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field label="New password" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
          {errors.root && (
            <p className="border border-burgundy/50 bg-burgundy/10 px-4 py-3 font-ui text-sm text-champagne-soft">
              {errors.root.message}
            </p>
          )}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Spinner className="h-4 w-4 border-rich-black/40 border-t-rich-black" />}
            {isSubmitting ? "Saving" : "Reset Password"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
