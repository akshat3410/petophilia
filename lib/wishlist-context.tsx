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

interface WishlistContextValue {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  count: number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const GUEST_KEY = "peto-wish-guest";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);

  // ── Fetch server wishlist ─────────────────────────────────────────────────
  const fetchServerWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (data.success) {
        setIds((data.data as Array<{ productId: string }>).map((w) => w.productId));
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  // ── Initialize ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;
    if (initialized.current) return;
    initialized.current = true;

    if (session?.user) {
      fetchServerWishlist();
    } else {
      try {
        const raw = localStorage.getItem(GUEST_KEY);
        if (raw) setIds(JSON.parse(raw));
      } catch { /* ignore */ }
    }
  }, [status, session, fetchServerWishlist]);

  // ── Toggle ─────────────────────────────────────────────────────────────────
  const toggle = useCallback(async (productId: string) => {
    const isIn = ids.includes(productId);

    if (!session?.user) {
      setIds((prev) => {
        const next = isIn ? prev.filter((x) => x !== productId) : [...prev, productId];
        try { localStorage.setItem(GUEST_KEY, JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
      return;
    }

    // Optimistic
    setIds((prev) => isIn ? prev.filter((x) => x !== productId) : [...prev, productId]);

    try {
      if (isIn) {
        await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      }
    } catch {
      // Revert on error
      setIds((prev) => isIn ? [...prev, productId] : prev.filter((x) => x !== productId));
    }
  }, [ids, session]);

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, has, toggle, count: ids.length, loading }),
    [ids, has, toggle, loading]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
