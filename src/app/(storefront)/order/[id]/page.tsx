import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderConfirmation } from "@/features/order/OrderConfirmation";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ email?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { email } = await searchParams;
  return (
    <Suspense>
      <OrderConfirmation id={id} email={email} />
    </Suspense>
  );
}
