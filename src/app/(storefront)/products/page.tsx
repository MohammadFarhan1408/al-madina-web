import { redirect } from "next/navigation";

// /products is an alias for the shop; keep one canonical catalog URL.
export default function Page() {
  redirect("/shop");
}
