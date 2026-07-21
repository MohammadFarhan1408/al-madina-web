import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";

type Timeline = ReturnType<typeof gsap.timeline>;
type Selector = (sel: string) => Element[];

/**
 * One-shot entrance for the P1 intro copy — plays once on mount (not scrubbed)
 * so the hero shows its branding elegantly at rest, then scroll drives the exit.
 */
export function playHeroIntro(q: Selector) {
  gsap.from(q('[data-anim="intro-line"]'), {
    yPercent: 120,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
    stagger: 0.16,
    delay: 0.15,
  });
  gsap.from(q('[data-anim="intro-soft"]'), {
    y: 20,
    opacity: 0,
    filter: "blur(8px)",
    duration: 1.1,
    ease: "power2.out",
    stagger: 0.1,
    delay: 0.45,
  });
  gsap.from(q('[data-anim="cue"]'), {
    opacity: 0,
    duration: 1,
    ease: "power1.out",
    delay: 1.1,
  });
}

interface Args {
  tl: Timeline;
  q: Selector;
  /** Ref whose `.current` renders a 0..1 progress to the canvas. */
  drawProgress: RefObject<(p: number) => void>;
}

/*
  One scrubbed timeline (total = 100 units) choreographs the whole pinned hero.
  Frame tween runs the full length; text/mist beats are positioned to land on
  meaningful moments of the bottle animation:

    frames   0–40   P1 Introduction   → intro copy in, then simplifies
    frames  40–115  P2 Discovery      → cap lifts, stage clears to just bottle
    frames 115–145  P3 Spray / Mist   → mist blooms, "A Darker Signature" emerges
    frames 145–176  P4 Product / CTA  → mist clears, product CTA resolves

  frame f → timeline pos = (f / 175) * 100, so spray (115–145) ≈ 66–83.
*/
export function buildHeroTimeline({ tl, q, drawProgress }: Args) {
  const frame = { p: 0 };
  tl.to(
    frame,
    {
      p: 1,
      ease: "none",
      duration: 100,
      onUpdate: () => drawProgress.current?.(frame.p),
    },
    0,
  );

  // P1 intro copy is revealed on load by a one-shot entrance (see playHeroIntro)
  // so it's visible at rest; the scrub only drives its EXIT. Scroll cue recedes
  // as the descent begins.
  tl.to(q('[data-anim="cue"]'), { opacity: 0, duration: 8, ease: "none" }, 2);

  // ---- P2 Discovery: intro copy dissolves upward, stage clears ----
  tl.to(
    q('[data-anim="intro-group"]'),
    {
      opacity: 0,
      y: -40,
      filter: "blur(10px)",
      duration: 14,
      ease: "power2.in",
    },
    26,
  );

  // ---- P3 Spray / Mist: atmospheric transition ----
  // Mist blooms just before the spray, peaks with the plume, lingers, clears.
  tl.fromTo(
    q('[data-anim="mist"]'),
    { opacity: 0, scale: 1.04 },
    { opacity: 1, scale: 1, duration: 14, ease: "power1.inOut" },
    58,
  );
  tl.to(
    q('[data-anim="mist"]'),
    { opacity: 0, scale: 1.06, duration: 12, ease: "power1.in" },
    82,
  );
  tl.fromTo(
    q('[data-anim="mist-drift"]'),
    { xPercent: -6 },
    { xPercent: 8, duration: 34, ease: "none" },
    58,
  );

  // New left content emerges from the mist.
  tl.from(
    q('[data-anim="signature-line"]'),
    {
      opacity: 0,
      y: 26,
      filter: "blur(14px)",
      duration: 10,
      ease: "power2.out",
      stagger: 1.6,
    },
    68,
  );
  tl.to(
    q('[data-anim="signature-group"]'),
    { opacity: 0, y: -24, filter: "blur(8px)", duration: 8, ease: "power2.in" },
    88,
  );

  // ---- P4 Product / CTA: resolves as the bottle settles ----
  tl.from(
    q('[data-anim="cta-line"]'),
    {
      opacity: 0,
      y: 28,
      filter: "blur(6px)",
      duration: 8,
      ease: "power3.out",
      stagger: 1.2,
    },
    90,
  );
}
