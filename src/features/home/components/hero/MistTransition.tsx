"use client";

/** Atmospheric mist for the spray moment — pure layered CSS gradients + blur,
 *  driven by the hero timeline (opacity/scale/drift). No particle engine.
 *  `simplified` drops the heaviest blur layer on low-power / mobile. */
export function MistTransition({ simplified = false }: { simplified?: boolean }) {
  return (
    <div
      data-anim="mist"
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 opacity-0"
    >
      <div data-anim="mist-drift" className="absolute inset-0">
        {/* soft champagne smoke drifting from the atomizer (upper-left of center) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 34% 40%, rgba(232,215,168,0.22), rgba(232,215,168,0) 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(48% 42% at 46% 30%, rgba(247,243,234,0.16), rgba(247,243,234,0) 62%)",
          }}
        />
        {/* darkening haze so old copy dissolves rather than cheap-fades */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 80% at 30% 50%, rgba(11,11,11,0.55), rgba(11,11,11,0) 65%)",
          }}
        />
      </div>
      {!simplified && (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(7px)",
            WebkitBackdropFilter: "blur(7px)",
            maskImage:
              "radial-gradient(60% 60% at 38% 40%, #000 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(60% 60% at 38% 40%, #000 0%, transparent 70%)",
          }}
        />
      )}
    </div>
  );
}
