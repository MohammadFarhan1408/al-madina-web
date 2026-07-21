"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/primitives";
import { Spinner } from "@/components/ui/feedback";
import { useUpdateProfile } from "@/hooks/queries/use-account";
import { useSessionStore } from "@/store/session.store";
import { getErrorMessage } from "@/lib/api/types";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  avatar: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
});
type Form = z.infer<typeof schema>;

export function AccountProfile() {
  const user = useSessionStore((s) => s.user);
  const update = useUpdateProfile();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    values: { fullName: user?.fullName ?? "", avatar: user?.avatar ?? "" },
  });

  const onSubmit = async (values: Form) => {
    try {
      await update.mutateAsync({ fullName: values.fullName, avatar: values.avatar || undefined });
    } catch (err) {
      setError("root", { message: getErrorMessage(err, "Couldn't update your profile.") });
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-2xl text-ivory">Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <Field label="Full name" error={errors.fullName?.message} {...register("fullName")} />
        <Field label="Avatar URL (optional)" placeholder="https://…" error={errors.avatar?.message} {...register("avatar")} />

        <div>
          <span className="mb-2 block font-ui text-[0.7rem] uppercase tracking-[0.2em] text-bronze">Email</span>
          <p className="border border-bronze/20 bg-charcoal/40 px-4 py-3 font-ui text-sm text-stone">{user?.email}</p>
        </div>
        <div>
          <span className="mb-2 block font-ui text-[0.7rem] uppercase tracking-[0.2em] text-bronze">Loyalty tier</span>
          <p className="font-ui text-sm text-antique-gold">{user?.tier}</p>
        </div>

        {errors.root && <p className="border border-burgundy/50 bg-burgundy/10 px-4 py-3 font-ui text-sm text-champagne-soft">{errors.root.message}</p>}
        {isSubmitSuccessful && !update.isError && (
          <p className="font-ui text-sm text-emerald">Profile updated.</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner className="h-4 w-4 border-rich-black/40 border-t-rich-black" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
}
