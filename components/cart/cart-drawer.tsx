"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { Button } from "@/components/ui/button";
import { formatPrice, FREE_SHIP_THRESHOLD } from "@/lib/utils";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, items, updateQty, remove, subtotal, loading } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, setDrawerOpen]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [drawerOpen]);

  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);

  return (
    <>
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col bg-white shadow-soft-lg transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pb-4 pt-7">
          <div>
            <p className="mono-label">/your basket</p>
            <h2 className="mt-1 font-serif text-[28px] italic leading-none text-primary">
              The pantry
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin text-accent" />}
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close cart"
              className="grid h-10 w-10 place-items-center rounded-full text-primary transition-colors hover:bg-border/30"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Free shipping progress */}
        <div className="mx-7 rounded-2xl bg-accent/10 px-5 py-4">
          {remaining > 0 ? (
            <p className="text-[13px] font-semibold text-primary">
              Add <span className="font-bold text-accent">{formatPrice(remaining)}</span> more for free shipping 🐾
            </p>
          ) : (
            <p className="text-[13px] font-semibold text-accent">
              ✅ Free shipping unlocked! Handled with care.
            </p>
          )}
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-accent/20">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-accent/10">
                <span className="text-[36px]">🛒</span>
              </div>
              <p className="mt-5 text-[22px] font-black text-primary">Your cart is empty!</p>
              <p className="mt-2 max-w-[28ch] text-[14px] font-semibold text-muted">
                Browse our collection and add something your fur baby will love.
              </p>
              <Button onClick={() => setDrawerOpen(false)} variant="teal" size="sm" className="mt-6">
                Start shopping 🐾
              </Button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => {
                const price = item.product.price + (item.variant?.priceAdjustment ?? 0);
                const img = item.product.images[0];
                return (
                  <li key={item.id} className="flex gap-4">
                    {/* Product image */}
                    <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-sm bg-gray-100">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img.url} alt={img.alt ?? item.product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl">🐾</div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="mono-label">/{item.product.brand.name}</p>
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="mt-1 block text-[14px] font-medium leading-tight text-primary hover:text-accent"
                            onClick={() => setDrawerOpen(false)}
                          >
                            {item.product.name}
                            {item.variant && (
                              <span className="ml-1 text-muted">· {item.variant.value}</span>
                            )}
                          </Link>
                        </div>
                        <p className="shrink-0 font-mono text-[13px] text-primary">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <QtyStepper
                          qty={item.quantity}
                          onChange={(q) => updateQty(item.id, q)}
                          min={0}
                        />
                        <button
                          onClick={() => remove(item.id)}
                          className="text-[12px] font-semibold text-muted underline-offset-4 hover:text-[#E53935] hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border bg-white px-7 py-6">
            <div className="flex items-baseline justify-between">
              <p className="text-[14px] text-muted">Subtotal</p>
              <p className="font-mono text-[20px] text-primary">{formatPrice(subtotal)}</p>
            </div>
            <p className="mt-1 text-[12px] text-muted">
              Taxes and shipping calculated at checkout.
            </p>
            <Button asChild variant="coral" size="lg" className="mt-5 w-full">
              <Link href="/checkout" onClick={() => setDrawerOpen(false)}>
                Proceed to checkout
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
