import type { Metadata } from "next";
import { CollectionDetailPage } from "@/features/collections/CollectionDetailPage";
import { collectionsServer } from "@/services/catalog.server";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const collection = await collectionsServer.detail(id).catch(() => null);
  if (!collection) return { title: "Collection" };
  return {
    title: collection.title,
    description: collection.subtitle,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <CollectionDetailPage id={id} />;
}
