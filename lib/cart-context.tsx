"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";
import { products } from "@/lib/data";

interface CartContextValue {
  items: CartItem[];
  /** Items joined to their product, with bad IDs filtered out. */
  itemsWithProduct: Array<CartItem & { product: Product }>;
  count: number;
  subtotal: number;
  /** Drawer open state is co-located here so "add to cart" can open the drawer. */
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  add: (id: string, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "peto-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore — treat as empty cart
    }
    setHydrated(true);
  }, []);

  // Persist after any change — but only after first hydration so we
  // don't clobber the stored cart with the initial empty array.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full / disabled — silently skip
    }
  }, [items, hydrated]);

  const add = useCallback((id: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { id, qty }];
    });
    setDrawerOpen(true);
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.id !== id);
      const existing = prev.find((i) => i.id === id);
      if (existing) return prev.map((i) => (i.id === id ? { ...i, qty } : i));
      return [...prev, { id, qty }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemsWithProduct = items
      .map((i) => {
        const product = products.find((p) => p.id === i.id);
        return product ? { ...i, product } : null;
      })
      .filter((i): i is CartItem & { product: Product } => i !== null);

    const count = itemsWithProduct.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = itemsWithProduct.reduce((sum, i) => sum + i.product.price * i.qty, 0);

    return {
      items,
      itemsWithProduct,
      count,
      subtotal,
      drawerOpen,
      setDrawerOpen,
      add,
      updateQty,
      remove,
      clear,
    };
  }, [items, drawerOpen, add, updateQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
