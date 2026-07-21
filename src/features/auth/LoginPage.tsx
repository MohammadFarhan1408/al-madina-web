"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "./AuthShell";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/primitives";
import { Spinner } from "@/components/ui/feedback";
import { useSessionStore } from "@/store/session.store";
import { getErrorMessage } from "@/lib/api/types";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
type Form = z.infer<typeof schema>;

export function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";
  const signIn = useSessionStore((s) => s.signIn);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Form) => {
    try {
      await signIn(values.email, values.password);
      router.replace(next);
    } catch (err) {
      setError("root", { message: getErrorMessage(err, "Invalid email or password.") });
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign In"
      subtitle="Access your orders, wishlist and saved addresses."
      footer={
        <>
          New to the Maison?{" "}
          <Link href="/register" className="text-antique-gold hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Field label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />

        <div className="text-right">
          <Link href="/forgot-password" className="font-ui text-xs uppercase tracking-[0.16em] text-bronze hover:text-antique-gold">
            Forgot password?
          </Link>
        </div>

        {errors.root && (
          <p className="border border-burgundy/50 bg-burgundy/10 px-4 py-3 font-ui text-sm text-champagne-soft">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Spinner className="h-4 w-4 border-rich-black/40 border-t-rich-black" />}
          {isSubmitting ? "Signing In" : "Sign In"}
        </Button>
      </form>
    </AuthShell>
  );
}
