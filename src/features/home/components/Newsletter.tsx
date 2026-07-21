"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  // ponytail: no signup endpoint in Phase 1 — local acknowledgement only.
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSent(true);
  };

  return (
    <section className="relative overflow-hidden border-t border-bronze/15 bg-obsidian py-28 sm:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 120% at 50% 0%, rgba(154,123,51,0.16), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <p className="overline">The Maison Letter</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.03] text-ivory sm:text-6xl">
            First access to new
            <br />
            <span className="italic text-antique-gold">compositions</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md font-ui text-sm leading-relaxed text-stone">
            Private previews, limited releases and the occasional note from our
            perfumers. No noise.
          </p>
        </Reveal>

        <Reveal delay={120}>
          {sent ? (
            <p className="mt-10 font-editorial text-xl italic text-champagne-soft">
              Thank you — welcome to the Maison.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email address"
                className="min-w-0 flex-1 border border-bronze/40 bg-transparent px-5 py-3.5 font-ui text-sm text-ivory placeholder:text-stone focus:border-antique-gold focus:outline-none"
              />
              <button
                type="submit"
                className="bg-antique-gold px-7 py-3.5 font-ui text-sm font-medium uppercase tracking-[0.18em] text-rich-black transition-colors hover:bg-gold-bright"
              >
                Subscribe
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
