"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/feedback";
import { useCreateReview } from "@/hooks/queries/use-account";
import { getErrorMessage } from "@/lib/api/types";

export function WriteReview({
  productId,
  productName,
  onDone,
}: {
  productId: string;
  productName: string;
  onDone: () => void;
}) {
  const create = useCreateReview(productId);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    if (rating < 1) return setError("Please select a rating.");
    if (title.trim().length < 2) return setError("Add a short title.");
    if (body.trim().length < 5) return setError("Tell us a little more.");
    create.mutate(
      { rating, title: title.trim(), body: body.trim() },
      {
        onSuccess: onDone,
        onError: (err) => setError(getErrorMessage(err, "Couldn't submit your review.")),
      },
    );
  };

  return (
    <div className="mt-4 border border-bronze/25 bg-rich-black p-5">
      <p className="font-ui text-xs uppercase tracking-[0.16em] text-bronze">
        Review {productName}
      </p>

      <div className="mt-3 flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            className={`text-2xl leading-none transition-colors ${
              (hover || rating) >= n ? "text-antique-gold" : "text-smoke"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="mt-4 w-full border border-bronze/30 bg-charcoal px-4 py-2.5 font-ui text-sm text-ivory placeholder:text-smoke focus:border-antique-gold focus:outline-none"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share your impression…"
        rows={3}
        className="mt-3 w-full resize-none border border-bronze/30 bg-charcoal px-4 py-2.5 font-ui text-sm text-ivory placeholder:text-smoke focus:border-antique-gold focus:outline-none"
      />

      {error && <p className="mt-2 font-ui text-xs text-burgundy">{error}</p>}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={create.isPending}
          className="inline-flex items-center gap-2 bg-antique-gold px-6 py-2.5 font-ui text-[0.72rem] uppercase tracking-[0.18em] text-rich-black transition-colors hover:bg-gold-bright disabled:opacity-60"
        >
          {create.isPending && <Spinner className="h-3.5 w-3.5 border-rich-black/40 border-t-rich-black" />}
          Submit Review
        </button>
        <button
          type="button"
          onClick={onDone}
          className="font-ui text-[0.72rem] uppercase tracking-[0.18em] text-ivory/60 hover:text-ivory"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
