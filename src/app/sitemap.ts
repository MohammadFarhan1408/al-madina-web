import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { productsServer } from "@/services/products.server";
import { categoriesServer, collectionsServer } from "@/services/catalog.server";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/collections",
  "/fragrance-families",
  "/wishlist",
  "/cart",
  "/about",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/shipping-returns",
];

async function allProductIds(): Promise<string[]> {
  const ids: string[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await productsServer.list({ page, limit: 50 }).catch(() => null);
    if (!res) break;
    ids.push(...res.items.map((p) => p.id));
    if (!res.hasMore) break;
  }
  return ids;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productIds, categories, collections] = await Promise.all([
    allProductIds(),
    categoriesServer.list().catch(() => []),
    collectionsServer.list().catch(() => []),
  ]);

  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${SITE_URL}${route}`, lastModified: new Date() })),
    ...(categories ?? []).map((c) => ({ url: `${SITE_URL}/categories/${c.id}`, lastModified: new Date() })),
    ...(collections ?? []).map((c) => ({ url: `${SITE_URL}/collections/${c.id}`, lastModified: new Date() })),
    ...productIds.map((id) => ({ url: `${SITE_URL}/product/${id}`, lastModified: new Date() })),
  ];
}
