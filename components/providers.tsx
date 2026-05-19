"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { TweaksProvider } from "@/lib/tweaks-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MotionConfig reducedMotion="user">
        <TweaksProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <Toaster position="top-right" richColors closeButton />
            </CartProvider>
          </WishlistProvider>
        </TweaksProvider>
      </MotionConfig>
    </SessionProvider>
  );
}
