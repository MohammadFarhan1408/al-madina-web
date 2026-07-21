"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "./AuthShell";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/primitives";
import { Spinner } from "@/components/ui/feedback";
import { authService } from "@/services/auth.service";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type Form = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Form) => {
    // Backend always returns success (no account enumeration) — mirror that.
    await authService.forgotPassword(values.email).catch(() => {});
    setSent(true);
  };

  return (
    <AuthShell
      eyebrow="Password"
      title="Reset Password"
      subtitle={sent ? undefined : "Enter your email and we'll send a reset link."}
      footer={
        <Link href="/login" className="text-antique-gold hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <p className="border border-antique-gold/40 bg-antique-gold/5 px-5 py-4 text-center font-ui text-sm leading-relaxed text-ivory/85">
          If an account exists for that email, a reset link is on its way. Check your
          inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Spinner className="h-4 w-4 border-rich-black/40 border-t-rich-black" />}
            {isSubmitting ? "Sending" : "Send Reset Link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
