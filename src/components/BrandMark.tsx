/** Al Madina gold diamond mark (abstracted from the bottle label). */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path d="M20 2 L38 20 L20 38 L2 20 Z" strokeWidth="1.4" />
      <path d="M20 9 L31 20 L20 31 L9 20 Z" strokeWidth="1" opacity="0.7" />
      <path d="M20 14 L26 20 L20 26 L14 20 Z" strokeWidth="1" fill="currentColor" />
    </svg>
  );
}

/** Wordmark lockup: AL MADINA / ITTAR in the display face. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="font-display text-lg tracking-[0.28em]">AL MADINA</span>
      <span className="font-ui text-[0.6rem] tracking-[0.62em] text-antique-gold">
        ITTAR
      </span>
    </span>
  );
}
