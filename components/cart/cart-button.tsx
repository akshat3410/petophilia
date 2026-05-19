"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { CountBadge } from "@/components/ui/count-badge";

export function CartButton() {
  const { count, setDrawerOpen } = useCart();
  return (
    <button
      onClick={() => setDrawerOpen(true)}
      aria-label={`Cart (${count} items)`}
      className="relative grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-accent/10 hover:text-accent"
    >
      <ShoppingBag size={18} strokeWidth={1.75} />
      <CountBadge count={count} />
    </button>
  );
}
