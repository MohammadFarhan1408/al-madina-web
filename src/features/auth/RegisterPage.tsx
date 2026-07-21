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
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type Form = z.infer<typeof schema>;

export function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";
  const signUp = useSessionStore((s) => s.signUp);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Form) => {
    try {
      await signUp(values.fullName, values.email, values.password);
      router.replace(next);
    } catch (err) {
      setError("root", { message: getErrorMessage(err, "We couldn't create your account.") });
    }
  };

  return (
    <AuthShell
      eyebrow="Join the Maison"
      title="Create Account"
      subtitle="Save your fragrances, track orders and check out faster."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-antique-gold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Full name" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
        <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Field label="Password" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />

        {errors.root && (
          <p className="border border-burgundy/50 bg-burgundy/10 px-4 py-3 font-ui text-sm text-champagne-soft">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Spinner className="h-4 w-4 border-rich-black/40 border-t-rich-black" />}
          {isSubmitting ? "Creating Account" : "Create Account"}
        </Button>
      </form>
    </AuthShell>
  );
}
