"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  brand: { name: string };
  images: Array<{ url: string; alt?: string | null }>;
  unit?: string | null;
  tint?: string | null;
}

export interface ServerCartItem {
  id: string;          // cartItemId
  productId: string;
  variantId?: string | null;
  quantity: number;
  product: CartItemProduct;
  variant?: { value: string; priceAdjustment: number } | null;
}

interface CartContextValue {
  items: ServerCartItem[];
  count: number;
  subtotal: number;
  loading: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  add: (productId: string, qty?: number, variantId?: string) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);
const GUEST_KEY = "peto-cart-guest";

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<ServerCartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const initialized = useRef(false);

  // ── Fetch server cart ────────────────────────────────────────────────────
  const fetchServerCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) setItems(data.data?.items ?? []);
    } catch {
      // ignore — keep existing state
    }
    setLoading(false);
  }, []);

  // ── Guest cart (localStorage) ─────────────────────────────────────────────
  const loadGuestCart = useCallback(() => {
    try {
      const raw = localStorage.getItem(GUEST_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, []);

  const saveGuestCart = useCallback((nextItems: ServerCartItem[]) => {
    try {
      localStorage.setItem(GUEST_KEY, JSON.stringify(nextItems));
    } catch { /* ignore */ }
  }, []);

  // ── Initialize on auth change ─────────────────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;
    if (initialized.current) return;
    initialized.current = true;

    if (session?.user) {
      fetchServerCart();
    } else {
      loadGuestCart();
    }
  }, [status, session, fetchServerCart, loadGuestCart]);

  // ── Add to cart ──────────────────────────────────────────────────────────
  const add = useCallback(async (productId: string, qty = 1, variantId?: string) => {
    if (!session?.user) {
      // Guest: optimistic update using productId as placeholder
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId && i.variantId === variantId);
        if (existing) {
          const next = prev.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + qty } : i
          );
          saveGuestCart(next);
          return next;
        }
        // Can't enrich without product data in guest mode — show sign-in nudge
        toast.info("Sign in to save your cart across devices");
        return prev;
      });
      setDrawerOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty, variantId }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.data?.items ?? []);
        setDrawerOpen(true);
      } else {
        toast.error(data.error ?? "Couldn't add to cart");
      }
    } catch {
      toast.error("Network error — please try again");
    }
    setLoading(false);
  }, [session, saveGuestCart]);

  // ── Update quantity ───────────────────────────────────────────────────────
  const updateQty = useCallback(async (itemId: string, qty: number) => {
    if (qty <= 0) return remove(itemId);

    if (!session?.user) {
      setItems((prev) => {
        const next = prev.map((i) => i.id === itemId ? { ...i, quantity: qty } : i);
        saveGuestCart(next);
        return next;
      });
      return;
    }

    // Optimistic
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, quantity: qty } : i));

    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      });
      if (!res.ok) {
        fetchServerCart(); // revert
        toast.error("Couldn't update quantity");
      }
    } catch {
      fetchServerCart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, saveGuestCart, fetchServerCart]);

  // ── Remove item ───────────────────────────────────────────────────────────
  const remove = useCallback(async (itemId: string) => {
    if (!session?.user) {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== itemId);
        saveGuestCart(next);
        return next;
      });
      return;
    }

    setItems((prev) => prev.filter((i) => i.id !== itemId)); // optimistic
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      if (!res.ok) {
        fetchServerCart(); // revert
        toast.error("Couldn't remove item");
      }
    } catch {
      fetchServerCart();
    }
  }, [session, saveGuestCart, fetchServerCart]);

  // ── Clear cart ────────────────────────────────────────────────────────────
  const clear = useCallback(async () => {
    setItems([]);
    if (!session?.user) {
      try { localStorage.removeItem(GUEST_KEY); } catch { /* ignore */ }
      return;
    }
    await fetch("/api/cart", { method: "DELETE" }).catch(() => {});
  }, [session]);

  const refresh = useCallback(async () => {
    if (session?.user) await fetchServerCart();
    else loadGuestCart();
  }, [session, fetchServerCart, loadGuestCart]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => {
      const base = i.product?.price ?? 0;
      const adj = i.variant?.priceAdjustment ?? 0;
      return s + (base + adj) * i.quantity;
    }, 0);

    return {
      items,
      count,
      subtotal,
      loading,
      drawerOpen,
      setDrawerOpen,
      add,
      updateQty,
      remove,
      clear,
      refresh,
    };
  }, [items, loading, drawerOpen, add, updateQty, remove, clear, refresh]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
