import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/features/catalog/CategoryPage";
import { categoriesServer } from "@/services/catalog.server";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = await categoriesServer.detail(id).catch(() => null);
  if (!category) return { title: "Category" };
  return { title: category.name, description: category.tagline };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const category = await categoriesServer.detail(id).catch(() => null);
  if (!category) notFound();
  return (
    <CategoryPage categoryId={id} name={category.name} tagline={category.tagline} />
  );
}
