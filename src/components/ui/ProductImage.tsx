"use client";

import Image from "next/image";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";

/** Product image with a branded fallback when no photography exists yet.
 *  Backend images[] are Cloudinary/localhost URLs (configured in next.config). */
export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b from-obsidian to-rich-black ${className}`}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
          priority={priority}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center text-bronze/40"
          aria-hidden
        >
          <BrandMark className="h-1/4 w-1/4 min-h-10 min-w-10" />
        </div>
      )}
    </div>
  );
}
