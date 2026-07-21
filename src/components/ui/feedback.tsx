import { ButtonLink } from "./primitives";

/** Skeleton block — dark shimmer for loading states. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-sm bg-gradient-to-r from-obsidian via-charcoal to-obsidian ${className}`}
    />
  );
}

/** Product grid skeleton. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

/** Centered spinner. */
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-bronze/30 border-t-antique-gold ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

/** Empty / zero-result state with optional CTA. */
export function EmptyState({
  eyebrow = "Nothing here yet",
  title,
  body,
  action,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
      <p className="overline">{eyebrow}</p>
      <h2 className="mt-5 font-display text-3xl text-ivory sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 font-ui text-sm leading-relaxed text-stone">{body}</p>}
      {action && (
        <ButtonLink href={action.href} variant="outline" className="mt-8">
          {action.label}
        </ButtonLink>
      )}
    </div>
  );
}

/** Error state for failed data loads. */
export function ErrorState({
  onRetry,
  message = "We couldn't load this right now.",
}: {
  onRetry?: () => void;
  message?: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
      <p className="overline text-burgundy">Something went wrong</p>
      <p className="mt-5 font-ui text-sm leading-relaxed text-stone">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-8 border border-bronze/60 px-8 py-3.5 font-ui text-[0.78rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:border-antique-gold hover:text-antique-gold"
        >
          Try again
        </button>
      )}
    </div>
  );
}
