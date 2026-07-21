import type {
  Product,
  Collection,
  Review,
  ScentFamily,
} from "@/types/catalog";

// ponytail: static mock typed to the real API contract. No product photography
// exists yet (public/images is empty) — tiles are typographic; the one real
// asset (the Oud Black bottle render) is reused as a shared placeholder image.
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

export const familyRail: { family: ScentFamily; label: string; note: string; count: number }[] = [
  { family: "oud", label: "Oud", note: "Deep · Resinous · Smoked", count: 12 },
  { family: "amber", label: "Amber", note: "Warm · Golden · Balsamic", count: 8 },
  { family: "floral", label: "Floral", note: "Rose · Jasmine · Orris", count: 9 },
  { family: "musk", label: "Musk", note: "Clean · Skin · Powder", count: 6 },
  { family: "woody", label: "Woody", note: "Sandal · Cedar · Vetiver", count: 7 },
  { family: "spicy", label: "Spicy", note: "Saffron · Cardamom · Clove", count: 5 },
];

export const collections: Collection[] = [
  {
    id: "oud-assembly",
    title: "The Oud Assembly",
    subtitle: "The Maison's darkest resins, aged and unhurried.",
    image: BOTTLE,
    accent: "gold",
    productIds: ["oud-black", "amber-taj"],
    productCount: 5,
    sortOrder: 1,
    slug: "oud-assembly",
  },
  {
    id: "verdant-maison",
    title: "Verdant Maison",
    subtitle: "Green hearts, dewed florals and cool vetiver.",
    image: BOTTLE,
    accent: "emerald",
    productIds: ["rose-damascena"],
    productCount: 4,
    sortOrder: 2,
    slug: "verdant-maison",
  },
  {
    id: "crimson-hours",
    title: "Crimson Hours",
    subtitle: "Rose, saffron and spice for the late evening.",
    image: BOTTLE,
    accent: "burgundy",
    productIds: ["saffron-nuit", "rose-damascena"],
    productCount: 6,
    sortOrder: 3,
    slug: "crimson-hours",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "oud-black",
    author: "Layla A.",
    rating: 5,
    title: "The sillage is extraordinary",
    body: "Oud Black opens dark and smoky, then settles into the softest amber. I am stopped and asked about it everywhere.",
    date: "2026-05-12",
    verified: true,
  },
  {
    id: "r2",
    productId: "saffron-nuit",
    author: "Omar R.",
    rating: 5,
    title: "A true Maison signature",
    body: "Saffron Nuit feels composed rather than loud — refined, warm, and it lasts from morning well into the night.",
    date: "2026-04-28",
    verified: true,
  },
  {
    id: "r3",
    productId: "rose-damascena",
    author: "Hana S.",
    rating: 5,
    title: "Rose the way it should be",
    body: "Not sweet, not soapy — a real Ta'if rose over oud. The bottle alone belongs on display.",
    date: "2026-06-03",
    verified: true,
  },
];

/** Fragrance-notes pyramid for the standalone editorial section. */
export const notePyramid = [
  { tier: "Top", notes: ["Saffron", "Bergamot"] },
  { tier: "Heart", notes: ["Rose", "Oud"] },
  { tier: "Base", notes: ["Amber", "Musk", "Sandalwood"] },
];
