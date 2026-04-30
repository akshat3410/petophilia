"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/product/product-image";
import { formatPrice, FREE_SHIP_THRESHOLD } from "@/lib/utils";
import { products } from "@/lib/data";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, itemsWithProduct, updateQty, subtotal, add } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, setDrawerOpen]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [drawerOpen]);

  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);

  const upsell = products
    .filter((p) => !itemsWithProduct.some((c) => c.id === p.id))
    .slice(0, 2);

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
        <div className="flex items-center justify-between px-7 pb-4 pt-7">
          <div>
            <p className="mono-label">/your basket</p>
            <h2 className="mt-1 font-serif text-[28px] italic leading-none text-ink">
              The pantry
            </h2>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mx-7 rounded-2xl bg-teal/10 px-5 py-4">
          {remaining > 0 ? (
            <p className="text-[13px] font-semibold text-ink">
              Add <span className="font-bold text-teal">{formatPrice(remaining)}</span> more for free shipping 🐾
            </p>
          ) : (
            <p className="text-[13px] font-semibold text-teal">
              ✅ Free shipping unlocked! Handled with care.
            </p>
          )}
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-teal/20">
            <div
              className="h-full rounded-full bg-teal transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          {itemsWithProduct.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-teal/10">
                <span className="text-[36px]">🛒</span>
              </div>
              <p className="mt-5 text-[22px] font-black text-ink">Your cart is empty!</p>
              <p className="mt-2 max-w-[28ch] text-[14px] font-semibold text-ink-muted">
                Browse our collection and add something your fur baby will love.
              </p>
              <Button onClick={() => setDrawerOpen(false)} variant="teal" size="sm" className="mt-6">
                Start shopping 🐾
              </Button>
            </div>
          ) : (
            <ul className="space-y-6">
              {itemsWithProduct.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-sm">
                    <ProductImage product={item.product} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="mono-label">/{item.product.brand}</p>
                        <p className="mt-1 text-[14px] font-medium leading-tight text-ink">
                          {item.product.name}
                        </p>
                      </div>
                      <p className="shrink-0 font-mono text-[13px] text-ink">
                        {formatPrice(item.product.price * item.qty)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QtyStepper qty={item.qty} onChange={(q) => updateQty(item.id, q)} min={0} />
                      <button
                        onClick={() => updateQty(item.id, 0)}
                        className="text-[12px] font-semibold text-ink-muted underline-offset-4 hover:text-[#E53935] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {itemsWithProduct.length > 0 && upsell.length > 0 && (
            <div className="mt-10 border-t border-ink/10 pt-6">
              <p className="mono-label">/you might also like</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {upsell.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => add(p.id, 1)}
                    className="group flex flex-col rounded-sm border border-ink/10 bg-white p-2 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft-md"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-[6px]">
                      <ProductImage product={p} />
                    </div>
                    <p className="mt-2.5 line-clamp-1 px-1 text-[12px] font-medium text-ink">
                      {p.name}
                    </p>
                    <div className="mt-1 flex items-center justify-between px-1">
                      <p className="font-mono text-[11px] text-ink-muted">
                        {formatPrice(p.price)}
                      </p>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-teal opacity-0 transition-opacity group-hover:opacity-100">
                        + add
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {itemsWithProduct.length > 0 && (
          <div className="border-t border-ink/10 bg-white px-7 py-6">
            <div className="flex items-baseline justify-between">
              <p className="text-[14px] text-ink-muted">Subtotal</p>
              <p className="font-mono text-[20px] text-ink">{formatPrice(subtotal)}</p>
            </div>
            <p className="mt-1 text-[12px] text-ink-muted">
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
