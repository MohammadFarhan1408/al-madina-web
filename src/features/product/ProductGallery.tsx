"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const gallery = images.length ? images : [undefined];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-5">
      {/* Main image */}
      <ProductImage
        src={gallery[active]}
        alt={name}
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="aspect-[4/5] w-full lg:flex-1"
      />

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex gap-3 lg:flex-col">
          {gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border transition-colors lg:h-24 lg:w-20 ${
                active === i ? "border-antique-gold" : "border-bronze/25 hover:border-bronze/60"
              }`}
            >
              <ProductImage src={src} alt={`${name} ${i + 1}`} sizes="80px" className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
