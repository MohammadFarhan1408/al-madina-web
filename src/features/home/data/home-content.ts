import type { Product } from "@/types/catalog";

// ponytail: static mock typed to the real API contract. No product photography
// exists yet (public/images is empty) — tiles are typographic; the one real
// asset (the Oud Black bottle render) is reused as a shared placeholder image.
//
// Only `featuredProducts` (EditorialFeature's named hero) and `notePyramid`
// (editorial copy) remain here — the homepage's best-seller rail, collections
// tiles, family counts, and testimonials now all come from the live API (see
// FeaturedFragrances.tsx, ShopByFamily.tsx, Reviews.tsx).
const BOTTLE = "/animations/oud-black/desktop/frame-020.jpg";

const base = {
  brand: "Al Madina Ittar",
  currency: "AED" as const,
  categoryId: "signature",
  inStock: true,
  isNewArrival: false,
  isSeasonal: false,
  variants: [],
  images: [BOTTLE],
};

export const featuredProducts: Product[] = [
  {
    ...base,
    id: "oud-black",
    name: "Oud Black",
    description:
      "Smoked oud and saffron over amber and musk — the Maison's midnight signature.",
    notes: ["Saffron", "Oud", "Amber", "Musk"],
    scentFamily: "oud",
    volumeMl: 100,
    price: 480,
    rating: 4.9,
    reviewCount: 214,
    badge: "bestseller",
    isFeatured: true,
    isBestSeller: true,
    isSignature: true,
    slug: "oud-black",
  },
  {
    ...base,
    id: "saffron-nuit",
    name: "Saffron Nuit",
    description: "A spiced amber veil lit by saffron and warm labdanum.",
    notes: ["Saffron", "Labdanum", "Amber"],
    scentFamily: "spicy",
    volumeMl: 100,
    price: 420,
    rating: 4.8,
    reviewCount: 132,
    badge: "new",
    isFeatured: true,
    isBestSeller: false,
    isSignature: false,
    isNewArrival: true,
    slug: "saffron-nuit",
  },
  {
    ...base,
    id: "amber-taj",
    name: "Amber Taj",
    description: "Golden amber, benzoin and a whisper of vanilla oud.",
    notes: ["Amber", "Benzoin", "Vanilla"],
    scentFamily: "amber",
    volumeMl: 100,
    price: 390,
    rating: 4.7,
    reviewCount: 98,
    isFeatured: true,
    isBestSeller: true,
    isSignature: false,
    slug: "amber-taj",
  },
  {
    ...base,
    id: "rose-damascena",
    name: "Rose Damascena",
    description: "Ta'if rose folded into oud and soft patchouli.",
    notes: ["Rose", "Oud", "Patchouli"],
    scentFamily: "floral",
    volumeMl: 100,
    price: 360,
    rating: 4.8,
    reviewCount: 156,
    badge: "exclusive",
    isFeatured: true,
    isBestSeller: false,
    isSignature: false,
    slug: "rose-damascena",
  },
];

/** Fragrance-notes pyramid for the standalone editorial section. */
export const notePyramid = [
  { tier: "Top", notes: ["Saffron", "Bergamot"] },
  { tier: "Heart", notes: ["Rose", "Oud"] },
  { tier: "Base", notes: ["Amber", "Musk", "Sandalwood"] },
];
