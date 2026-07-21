import { forwardRef } from "react";

const INPUT =
  "w-full border border-bronze/30 bg-rich-black px-4 py-3 font-ui text-sm text-ivory placeholder:text-smoke transition-colors focus:border-antique-gold focus:outline-none disabled:opacity-50";

const LABEL =
  "mb-2 block font-ui text-[0.7rem] uppercase tracking-[0.2em] text-bronze";

/** Labelled text input with error message. Works with RHF register(). */
export const Field = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }
>(function Field({ label, error, className = "", ...props }, ref) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <input
        ref={ref}
        className={`${INPUT} ${error ? "border-burgundy" : ""} ${className}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <span className="mt-1.5 block font-ui text-xs text-burgundy">{error}</span>}
    </label>
  );
});
