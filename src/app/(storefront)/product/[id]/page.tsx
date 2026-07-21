import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/features/product/ProductDetailView";
import { productsServer } from "@/services/products.server";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await productsServer.detail(id).catch(() => null);
  if (!product) return { title: "Fragrance" };
  return {
    title: product.name,
    description:
      product.metaDescription ||
      product.description ||
      `${product.name} — ${product.scentFamily} fragrance by Al Madina Ittar.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.length ? [product.images[0]] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const product = await productsServer.detail(id).catch(() => null);
  if (!product) notFound();

  // Product structured data for SEO / rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: product.brand },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "AED",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView product={product} />
    </>
  );
}
