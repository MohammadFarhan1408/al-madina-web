"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useFrameSequence } from "./hero/useFrameSequence";
import { FrameCanvas } from "./hero/FrameCanvas";
import { MistTransition } from "./hero/MistTransition";
import { buildHeroTimeline, playHeroIntro } from "./hero/buildHeroTimeline";

/** Masked line: inner span slides up from behind an overflow-hidden clip. */
function MaskLine({
  children,
  className = "",
  anim = "intro-line",
}: {
  children: React.ReactNode;
  className?: string;
  anim?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <span data-anim={anim} className={`block ${className}`}>
        {children}
      </span>
    </span>
  );
}

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { canvasRef, ready, drawProgress } = useFrameSequence();

  // Keep pin math correct once the first frame paints / layout settles.
  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  useGSAP(
    () => {
      if (reduced) return;
      const stage = stageRef.current;
      if (!stage) return;
      const q = gsap.utils.selector(stageRef);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => "+=" + window.innerHeight * 6,
          scrub: 1,
          pin: stage,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      buildHeroTimeline({ tl, q, drawProgress });
      playHeroIntro(q);
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  // Single stable tree for both modes — layout is className-driven, GSAP is
  // gated on `reduced`. Never swap between two different trees: ScrollTrigger's
  // pin-spacer restructures the DOM, so unmounting a pinned tree throws
  // `removeChild`. Keeping the <section>/stage stable lets GSAP's own revert
  // clean the pin when `reduced` flips.
  const stageCls = reduced
    ? "relative w-full overflow-hidden"
    : "relative h-[100svh] w-full overflow-hidden";
  const leftWrap = reduced
    ? "relative z-30 mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16"
    : "absolute inset-y-0 left-0 z-30 w-[min(88vw,34rem)] px-6 sm:px-10 lg:px-16";
  const leftInner = reduced ? "flex flex-col gap-20" : "relative h-full";
  const groupCls = reduced
    ? "relative"
    : "absolute inset-0 flex flex-col justify-center";

  return (
    <section ref={containerRef} className="relative bg-rich-black">
      <div ref={stageRef} className={stageCls}>
        <FrameCanvas canvasRef={canvasRef} ready={ready} />
        {!reduced && <MistTransition />}

        {/* legibility vignette for the left gutter + base */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(11,11,11,0.86) 0%, rgba(11,11,11,0.28) 32%, rgba(11,11,11,0) 52%), linear-gradient(0deg, rgba(11,11,11,0.7) 0%, rgba(11,11,11,0) 26%)",
          }}
        />
        {reduced && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-rich-black/70" />
        )}

        {/* LEFT — three phase groups (cross-faded in motion, stacked in reduced) */}
        <div className={leftWrap}>
          <div className={leftInner}>
            <div data-anim="intro-group" className={groupCls}>
              <IntroCopy masked={!reduced} />
            </div>
            <div data-anim="signature-group" className={groupCls}>
              <SignatureCopy anim={!reduced} />
            </div>
            <div className={groupCls}>
              <CtaCopy anim={!reduced} />
            </div>
          </div>
        </div>

        {/* RIGHT — minimal editorial product detail (motion mode only) */}
        {!reduced && (
          <div
            data-anim="intro-group"
            className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 text-right sm:right-10 lg:right-16 md:block"
          >
            <p data-anim="intro-soft" className="overline mb-4">
              Eau de Parfum
            </p>
            <p
              data-anim="intro-soft"
              className="font-display text-5xl text-ivory lg:text-6xl"
            >
              100<span className="ml-1 text-2xl text-antique-gold">ml</span>
            </p>
            <div data-anim="intro-soft" className="mt-6 space-y-1.5">
              <p className="font-ui text-sm tracking-wide text-ivory-dim/80">
                Saffron · Oud
              </p>
              <p className="font-ui text-sm tracking-wide text-ivory-dim/80">
                Amber · Musk
              </p>
            </div>
            <div className="rule-gold mt-6 w-24 ml-auto" />
            <p
              data-anim="intro-soft"
              className="mt-4 font-ui text-xs uppercase tracking-[0.3em] text-stone"
            >
              Family — Oud · Woody
            </p>
          </div>
        )}

        {/* scroll cue (motion mode only) */}
        {!reduced && (
          <div
            data-anim="cue"
            className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center"
          >
            <p className="overline mb-3 text-[0.62rem]">Scroll to unveil</p>
            <span className="mx-auto block h-10 w-px bg-linear-to-b from-antique-gold to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------ Phase copy blocks ------------------------ */

/** Headline line: masked (animated clip) in motion mode, plain in reduced. */
function HeroLine({
  masked,
  className,
  children,
}: {
  masked: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (masked) return <MaskLine className={className}>{children}</MaskLine>;
  return <span className={`block ${className ?? ""}`}>{children}</span>;
}

function IntroCopy({ masked = false }: { masked?: boolean }) {
  return (
    <div>
      <p data-anim={masked ? "intro-soft" : undefined} className="overline mb-6">
        Al Madina Ittar
      </p>
      <h1 className="display-hero text-ivory">
        <HeroLine masked={masked} className="text-ivory">
          Oud
        </HeroLine>
        <HeroLine masked={masked} className="italic text-antique-gold">
          Black
        </HeroLine>
      </h1>
      <p
        data-anim={masked ? "intro-soft" : undefined}
        className="font-editorial mt-6 text-xl italic text-ivory-dim sm:text-2xl"
      >
        An Expression of Depth.
      </p>
      <p
        data-anim={masked ? "intro-soft" : undefined}
        className="mt-5 max-w-full font-ui text-sm leading-relaxed text-stone sm:max-w-sm"
      >
        A nocturnal composition built on smoked oud and saffron — the signature
        of the Maison, bottled in obsidian and gold.
      </p>
    </div>
  );
}

function SignatureCopy({ anim = false }: { anim?: boolean }) {
  const a = (n: string) => (anim ? n : undefined);
  return (
    <div>
      <p data-anim={a("signature-line")} className="overline mb-6">
        A Darker Signature
      </p>
      <p
        data-anim={a("signature-line")}
        className="font-display text-4xl leading-tight text-ivory sm:text-5xl lg:text-6xl"
      >
        Oud · Saffron · Amber
      </p>
      <p
        data-anim={a("signature-line")}
        className="font-editorial mt-8 max-w-full text-xl italic leading-relaxed text-champagne-soft sm:max-w-md sm:text-2xl"
      >
        A fragrance that lingers long after you leave.
      </p>
    </div>
  );
}

function CtaCopy({ anim = false }: { anim?: boolean }) {
  const a = (n: string) => (anim ? n : undefined);
  return (
    <div>
      <p data-anim={a("cta-line")} className="overline mb-5">
        Oud Black — 100 ml
      </p>
      <p
        data-anim={a("cta-line")}
        className="font-display text-5xl leading-[0.95] text-ivory sm:text-6xl lg:text-7xl"
      >
        A signature
        <br />
        written in <span className="italic text-antique-gold">shadow.</span>
      </p>
      <div data-anim={a("cta-line")} className="mt-9 flex flex-wrap items-center gap-4">
        <a
          href="#featured"
          className="group inline-flex items-center gap-3 border border-antique-gold bg-antique-gold px-7 py-3.5 font-ui text-sm font-medium uppercase tracking-[0.18em] text-rich-black transition-colors hover:bg-gold-bright"
        >
          Discover Oud Black
        </a>
        <button
          type="button"
          className="inline-flex items-center gap-3 border border-bronze/60 px-7 py-3.5 font-ui text-sm font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:border-antique-gold hover:text-antique-gold"
        >
          Add to Bag — AED 480
        </button>
      </div>
    </div>
  );
}
