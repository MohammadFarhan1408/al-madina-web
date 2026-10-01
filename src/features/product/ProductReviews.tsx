"use client";

import { useState } from "react";
import Link from "next/link";
import { Rating } from "@/components/ui/primitives";
import { Spinner } from "@/components/ui/feedback";
import { useProductReviews } from "@/hooks/queries/use-catalog";
import { useSessionStore } from "@/store/session.store";
import { WriteReview } from "@/features/account/WriteReview";
import type { Review } from "@/types/catalog";

export function ProductReviews({
  productId,
  productName,
  rating,
  reviewCount,
}: {
  productId: string;
  productName: string;
  rating: number;
  reviewCount: number;
}) {
  const query = useProductReviews(productId);
  const reviews: Review[] = query.data?.pages.flatMap((p) => p.items) ?? [];
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const [writing, setWriting] = useState(false);

  return (
    <section className="border-t border-bronze/15 py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="overline">Reviews</p>
          <h2 className="mt-4 font-display text-3xl text-ivory sm:text-4xl">
            What the Maison is saying
          </h2>
        </div>
        <div className="flex items-center gap-6">
          {reviewCount > 0 && (
            <div className="text-right">
              <p className="font-display text-4xl text-ivory">{rating.toFixed(1)}</p>
              <Rating value={rating} count={reviewCount} className="mt-1" />
            </div>
          )}
          {!writing &&
            (isAuthenticated ? (
              <button
                type="button"
                onClick={() => setWriting(true)}
                className="shrink-0 border border-bronze/50 px-5 py-2.5 font-ui text-xs uppercase tracking-[0.18em] text-ivory transition-colors hover:border-antique-gold hover:text-antique-gold"
              >
                Write a Review
              </button>
            ) : (
              <Link
                href={`/login?next=/product/${productId}`}
                className="shrink-0 font-ui text-xs uppercase tracking-[0.18em] text-antique-gold hover:underline"
              >
                Sign in to review
              </Link>
            ))}
        </div>
      </div>

      {writing && (
        <WriteReview
          productId={productId}
          productName={productName}
          onDone={() => setWriting(false)}
        />
      )}

      {query.isLoading ? (
        <div className="py-12 text-center">
          <Spinner />
        </div>
      ) : reviews.length === 0 ? (
        <p className="mt-10 font-editorial text-lg italic text-stone">
          No reviews yet — be the first to share your impression.
        </p>
      ) : (
        <ul className="mt-10 grid gap-px overflow-hidden border border-bronze/15 bg-bronze/15 sm:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id} className="bg-charcoal/50 p-7">
              <div className="flex items-center justify-between gap-4">
                <Rating value={r.rating} />
                {r.verified && (
                  <span className="font-ui text-[0.6rem] uppercase tracking-[0.2em] text-antique-gold">
                    Verified
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-xl text-ivory">{r.title}</h3>
              <p className="mt-3 font-ui text-sm leading-relaxed text-ivory-dim/70">
                {r.body}
              </p>
              <p className="mt-5 font-ui text-xs uppercase tracking-[0.16em] text-bronze">
                {r.author} · {new Date(r.date).toLocaleDateString("en-AE", { year: "numeric", month: "short" })}
              </p>
            </li>
          ))}
        </ul>
      )}

      {query.hasNextPage && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="border border-bronze/50 px-8 py-3 font-ui text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:border-antique-gold hover:text-antique-gold disabled:opacity-50"
          >
            {query.isFetchingNextPage ? "Loading" : "More reviews"}
          </button>
        </div>
      )}
    </section>
  );
}
