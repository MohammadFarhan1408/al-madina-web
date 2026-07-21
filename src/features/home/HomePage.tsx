import { CinematicHero } from "@/features/home/components/CinematicHero";
import { FragranceNotes } from "@/features/home/components/FragranceNotes";
import { FeaturedFragrances } from "@/features/home/components/FeaturedFragrances";
import { ShopByFamily } from "@/features/home/components/ShopByFamily";
import { BrandStory } from "@/features/home/components/BrandStory";
import { EditorialFeature } from "@/features/home/components/EditorialFeature";
import { Reviews } from "@/features/home/components/Reviews";
import { Newsletter } from "@/features/home/components/Newsletter";

// Header + footer are provided by the (storefront) group layout so every page
// shares one chrome. This renders the homepage's cinematic body only.
export function HomePage() {
  return (
    <main>
      <CinematicHero />
      <FragranceNotes />
      <FeaturedFragrances />
      <ShopByFamily />
      <BrandStory />
      <EditorialFeature />
      <Reviews />
      <Newsletter />
    </main>
  );
}
