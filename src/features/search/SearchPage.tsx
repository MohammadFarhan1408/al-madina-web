"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, PageIntro } from "@/components/ui/primitives";
import { ProductGrid } from "@/components/ui/ProductGrid";
import {
  useSearch,
  useSuggest,
  useTrending,
  flattenProducts,
} from "@/hooks/queries/use-catalog";

export function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const urlQuery = params.get("q") ?? "";
  const [input, setInput] = useState(urlQuery);
  const [showSuggest, setShowSuggest] = useState(false);

  // Keep input in sync if the URL changes (e.g. trending chip click).
  useEffect(() => setInput(urlQuery), [urlQuery]);

  const suggestions = useSuggest(input);
  const trending = useTrending();
  const results = useSearch(urlQuery);
  const products = flattenProducts(results.data);

  const submit = useCallback(
    (q: string) => {
      const term = q.trim();
      setShowSuggest(false);
      router.replace(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
    },
    [router],
  );

  return (
    <main>
      <PageIntro
        eyebrow="Search"
        title="Find your scent"
        description="Search the Maison by name, note or family."
        align="center"
      />

      <Container className="py-12 sm:py-16">
        {/* Search box */}
        <div className="relative mx-auto max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex items-center gap-3 border-b border-bronze/40 pb-4 focus-within:border-antique-gold"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-bronze" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="search"
              value={input}
              autoFocus
              onChange={(e) => {
                setInput(e.target.value);
                setShowSuggest(true);
              }}
              onFocus={() => setShowSuggest(true)}
              placeholder="Oud, rose, saffron…"
              className="w-full bg-transparent font-display text-2xl text-ivory placeholder:text-smoke focus:outline-none sm:text-3xl"
            />
          </form>

          {/* Suggestions dropdown */}
          {showSuggest && input.trim().length >= 2 && (suggestions.data?.length ?? 0) > 0 && (
            <ul className="absolute inset-x-0 top-full z-20 mt-2 border border-bronze/25 bg-charcoal/95 backdrop-blur-md">
              {suggestions.data!.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => {
                      setInput(s);
                      submit(s);
                    }}
                    className="w-full px-5 py-3 text-left font-ui text-sm text-ivory/85 transition-colors hover:bg-onyx hover:text-antique-gold"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Trending (empty state) */}
        {!urlQuery && (
          <div className="mx-auto mt-12 max-w-2xl text-center">
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-bronze">
              Trending
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {(trending.data ?? []).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => submit(t)}
                  className="border border-bronze/30 px-4 py-2 font-ui text-sm text-ivory/80 transition-colors hover:border-antique-gold hover:text-antique-gold"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {urlQuery && (
          <div className="mt-16">
            <p className="mb-8 font-ui text-xs uppercase tracking-[0.2em] text-stone">
              Results for “{urlQuery}”
            </p>
            <ProductGrid
              products={products}
              isLoading={results.isLoading}
              isError={results.isError}
              onRetry={() => results.refetch()}
              hasMore={results.hasNextPage}
              isFetchingMore={results.isFetchingNextPage}
              onLoadMore={() => results.fetchNextPage()}
              emptyTitle={`No matches for “${urlQuery}”`}
              emptyBody="Try a different note, name or fragrance family."
            />
          </div>
        )}
      </Container>
    </main>
  );
}
