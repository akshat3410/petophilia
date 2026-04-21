"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { TweaksProvider } from "@/lib/tweaks-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { TweaksPanel } from "@/components/tweaks/tweaks-panel";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TweaksProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
          <CartDrawer />
          <TweaksPanel />
        </CartProvider>
      </WishlistProvider>
    </TweaksProvider>
  );
}
