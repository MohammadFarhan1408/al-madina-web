import { OrderDetail } from "@/features/account/OrderDetail";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
