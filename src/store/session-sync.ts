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
import { useCartStore, keyOf, type CartItem } from "./cart.store";
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

/** Union two line sets by productId+volumeMl, summing quantities on overlap.
 * Used so logging in on a second device — whose local cart is empty — merges
 * into whatever's already on the server instead of overwriting it. */
function mergeLines(
  a: CartLineInput[],
  b: { productId: string; quantity: number; volumeMl?: number }[],
): CartLineInput[] {
  const byKey = new Map<string, CartLineInput>();
  for (const line of [...a, ...b]) {
    const key = keyOf(line.productId, line.volumeMl);
    const existing = byKey.get(key);
    byKey.set(key, existing ? { ...existing, quantity: existing.quantity + line.quantity } : { ...line });
  }
  return [...byKey.values()];
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

  // Cart: merge guest lines into whatever's already on the server — logging
  // in on a second device with an empty local cart must not wipe out items
  // already saved from another (cart.module.ts's /cart/sync fully replaces
  // the server cart with whatever it's given).
  const localItems = useCartStore.getState().items;
  const serverCart = await cartService.get().catch(() => null);
  const merged = mergeLines(toLines(localItems), serverCart?.items ?? []);
  const reconciled = await cartService.sync(merged).catch(() => null);
  if (!reconciled) return;
  const items = await reconciledToCartItems(reconciled.items);
  useCartStore.getState().replace(items);
}

/** Pull the authoritative server cart on boot for an already-authenticated
 * session (e.g. a page reload), rather than trusting stale localStorage. */
export async function hydrateCartOnBoot() {
  const cart = await cartService.get().catch(() => null);
  if (!cart) return;
  const items = await reconciledToCartItems(cart.items);
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
    // Best-effort: a failure here means local and server state have
    // diverged for this one item. Logged rather than silently swallowed —
    // startBackgroundSync has no UI to surface it through, and the next
    // successful sync (login, or any later edit) naturally reconciles.
    added.forEach((id) => void wishlistService.add(id).catch((err) => console.error("Wishlist sync failed", err)));
    removed.forEach((id) => void wishlistService.remove(id).catch((err) => console.error("Wishlist sync failed", err)));
  });

  // Trailing debounce: a burst of +/- taps becomes one request carrying the
  // final state. ponytail: a tab closed inside the window loses that last
  // edit; add a pagehide flush if that matters.
  let cartTimer: ReturnType<typeof setTimeout> | undefined;
  useCartStore.subscribe((state) => {
    clearTimeout(cartTimer);
    cartTimer = setTimeout(() => {
      if (!useSessionStore.getState().isAuthenticated) return;
      void cartService.sync(toLines(state.items)).catch((err) => console.error("Cart sync failed", err));
    }, 500);
  });
}
