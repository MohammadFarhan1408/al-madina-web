/**
 * Keeps the local Zustand cart/wishlist (source of truth for guests) synced with
 * the server (source of truth once authenticated — both are requireAuth). Two
 * entry points, mirroring the mobile app:
 *  - syncGuestDataOnLogin: one-shot merge-then-replace, called right after sign-in/up.
 *  - startBackgroundSync: called once at boot; pushes later local edits to the
 *    server (fire-and-forget) whenever authenticated. One sync path only.
 */
import { cartService } from "@/services/cart.service";
import { wishlistService } from "@/services/wishlist.service";
import { productsService } from "@/services/products.service";
import { useCartStore, type CartItem } from "./cart.store";
import { useWishlistStore } from "./wishlist.store";
import { useSessionStore } from "./session.store";
import type { CartLineInput, ReconciledCartItem } from "@/types/commerce";

function toLines(items: CartItem[]): CartLineInput[] {
  return items.map((i) => ({
    productId: i.product.id,
    quantity: i.quantity,
    volumeMl: i.volumeMl,
  }));
}

/** Rebuild full-product cart items from the server's reconciled lines. */
async function reconciledToCartItems(lines: ReconciledCartItem[]): Promise<CartItem[]> {
  const ids = [...new Set(lines.map((l) => l.productId))];
  if (ids.length === 0) return [];
  const products = await productsService.byIds(ids);
  const byId = new Map(products.map((p) => [p.id, p]));
  return lines
    .map((l): CartItem | null => {
      const product = byId.get(l.productId);
      return product ? { product, quantity: l.quantity, volumeMl: l.volumeMl } : null;
    })
    .filter((i): i is CartItem => i !== null);
}

export async function syncGuestDataOnLogin() {
  // Wishlist: push guest ids, then adopt the server's union.
  const localIds = useWishlistStore.getState().ids;
  await Promise.allSettled(localIds.map((id) => wishlistService.add(id)));
  const serverIds = await wishlistService.getIds().catch(() => localIds);
  useWishlistStore.getState().replace(serverIds);

  // Cart: push guest lines, adopt the server-reconciled result.
  const localItems = useCartStore.getState().items;
  const reconciled = await cartService.sync(toLines(localItems)).catch(() => null);
  if (!reconciled) return;
  const items = await reconciledToCartItems(reconciled.items);
  useCartStore.getState().replace(items);
}

let backgroundSyncStarted = false;

export function startBackgroundSync() {
  if (backgroundSyncStarted) return;
  backgroundSyncStarted = true;

  let lastWishIds: string[] = useWishlistStore.getState().ids;
  useWishlistStore.subscribe((state) => {
    if (!useSessionStore.getState().isAuthenticated) {
      lastWishIds = state.ids;
      return;
    }
    const added = state.ids.filter((id) => !lastWishIds.includes(id));
    const removed = lastWishIds.filter((id) => !state.ids.includes(id));
    lastWishIds = state.ids;
    added.forEach((id) => void wishlistService.add(id));
    removed.forEach((id) => void wishlistService.remove(id));
  });

  useCartStore.subscribe((state) => {
    if (!useSessionStore.getState().isAuthenticated) return;
    void cartService.sync(toLines(state.items));
  });
}
