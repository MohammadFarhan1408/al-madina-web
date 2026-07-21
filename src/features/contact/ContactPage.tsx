"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Reveal } from "@/components/Reveal";
import { Field } from "@/components/ui/Field";
import { Button, Container, PageIntro } from "@/components/ui/primitives";
import { Spinner } from "@/components/ui/feedback";
import { contactService } from "@/services/contact.service";
import { getErrorMessage } from "@/lib/api/types";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});
type Form = z.infer<typeof schema>;

const TEXTAREA =
  "w-full border border-bronze/30 bg-rich-black px-4 py-3 font-ui text-sm text-ivory placeholder:text-smoke transition-colors focus:border-antique-gold focus:outline-none disabled:opacity-50";
const LABEL = "mb-2 block font-ui text-[0.7rem] uppercase tracking-[0.2em] text-bronze";

export function ContactPage() {
  const submit = useMutation({ mutationFn: contactService.submit });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Form) => {
    try {
      await submit.mutateAsync(values);
      reset();
    } catch (err) {
      setError("root", { message: getErrorMessage(err, "Couldn't send your message. Please try again.") });
    }
  };

  return (
    <main>
      <PageIntro
        eyebrow="Get in Touch"
        title="Contact"
        description="For bespoke commissions, trade enquiries or a question about your order, write to us — the Maison replies within one business day."
      />
      <Container className="grid gap-14 py-20 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <h2 className="font-display text-2xl text-ivory">Visit the Atelier</h2>
          <dl className="mt-6 space-y-5 font-ui text-sm text-stone">
            <div>
              <dt className="text-bronze">Boutique</dt>
              <dd className="mt-1 text-ivory-dim">Al Fahidi Street, Bur Dubai, UAE</dd>
            </div>
            <div>
              <dt className="text-bronze">Email</dt>
              <dd className="mt-1 text-ivory-dim">concierge@almadinaittar.com</dd>
            </div>
            <div>
              <dt className="text-bronze">Phone</dt>
              <dd className="mt-1 text-ivory-dim">+971 4 123 4567</dd>
            </div>
            <div>
              <dt className="text-bronze">Hours</dt>
              <dd className="mt-1 text-ivory-dim">Saturday – Thursday, 10am – 10pm</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal className="lg:col-span-7">
          {submit.isSuccess ? (
            <div className="border border-antique-gold/40 bg-charcoal/40 px-6 py-8">
              <p className="font-display text-xl text-ivory">Message received.</p>
              <p className="mt-2 font-ui text-sm text-stone">
                Thank you for writing to Al Madina Ittar — we&apos;ll be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Field label="Full name" error={errors.name?.message} {...register("name")} />
              <Field label="Email" type="email" error={errors.email?.message} {...register("email")} />
              <label className="block">
                <span className={LABEL}>Message</span>
                <textarea
                  rows={6}
                  className={`${TEXTAREA} ${errors.message ? "border-burgundy" : ""}`}
                  aria-invalid={!!errors.message}
                  {...register("message")}
                />
                {errors.message && (
                  <span className="mt-1.5 block font-ui text-xs text-burgundy">{errors.message.message}</span>
                )}
              </label>

              {errors.root && (
                <p className="border border-burgundy/50 bg-burgundy/10 px-4 py-3 font-ui text-sm text-champagne-soft">
                  {errors.root.message}
                </p>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="h-4 w-4 border-rich-black/40 border-t-rich-black" />}
                Send Message
              </Button>
            </form>
          )}
        </Reveal>
      </Container>
    </main>
  );
}
