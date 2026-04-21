"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ChevronRight, Truck, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { ProductImage } from "@/components/product/product-image";
import { ProductCard } from "@/components/product/product-card";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import type { Product } from "@/lib/types";
import {
  formatPrice,
  formatRating,
  subscribePrice,
  SUBSCRIBE_DISCOUNT,
  cn,
} from "@/lib/utils";

interface Props {
  product: Product;
  related: Product[];
}

export function ProductDetail({ product, related }: Props) {
  const [mode, setMode] = useState<"once" | "sub">("once");
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const saved = has(product.id);

  const price = mode === "sub" ? subscribePrice(product.price) : product.price;

  return (
    <>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-8 pt-8">
        <nav className="flex items-center gap-2 text-[12px] text-ink-muted">
          <Link href="/" className="hover:text-coral">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/category/${product.pet}`} className="capitalize hover:text-coral">
            {product.pet}
          </Link>
          <ChevronRight size={12} />
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto mt-6 grid max-w-[1400px] grid-cols-12 gap-10 px-8 pb-16">
        {/* Gallery — sticky */}
        <div className="col-span-12 md:col-span-7">
          <div className="md:sticky md:top-[100px]">
            <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: "5/6" }}>
              <ProductImage product={product} large />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  className={cn(
                    "relative overflow-hidden rounded-[8px] border",
                    i === 0 ? "border-ink" : "border-ink/10",
                  )}
                  style={{ aspectRatio: "1/1" }}
                >
                  <ProductImage product={product} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Floating purchase card */}
        <div className="col-span-12 md:col-span-5">
          <div className="rounded-lg bg-white p-8 shadow-soft-md">
            <p className="mono-label">/{product.brand}</p>
            <h1 className="mt-3 font-serif text-[44px] italic leading-[1] text-ink">
              {product.name}
            </h1>
            <p className="mt-3 text-[14px] text-ink-muted">{product.unit}</p>
            <p className="mt-4 text-[15px] leading-[1.55] text-ink-soft">{product.blurb}</p>

            <div className="mt-5 flex items-center gap-3 font-mono text-[12px] text-ink-muted">
              <span>★ {formatRating(product.rating, product.reviews)}</span>
            </div>

            {/* Subscribe / once toggle */}
            <div className="mt-7 space-y-2">
              <button
                onClick={() => setMode("once")}
                className={cn(
                  "flex w-full items-center justify-between rounded-[12px] border p-4 text-left transition-colors",
                  mode === "once" ? "border-ink bg-ink/[0.03]" : "border-ink/10",
                )}
              >
                <div>
                  <p className="font-medium text-ink">One-time purchase</p>
                  <p className="mt-0.5 text-[12px] text-ink-muted">Single delivery.</p>
                </div>
                <p className="font-mono text-[15px] text-ink">{formatPrice(product.price)}</p>
              </button>
              <button
                onClick={() => setMode("sub")}
                className={cn(
                  "flex w-full items-center justify-between rounded-[12px] border p-4 text-left transition-colors",
                  mode === "sub" ? "border-ink bg-ink/[0.03]" : "border-ink/10",
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink">Subscribe & save</p>
                    <span className="rounded-full bg-coral/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-coral-deep">
                      −{Math.round(SUBSCRIBE_DISCOUNT * 100)}%
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-ink-muted">Every 4 weeks. Skip anytime.</p>
                </div>
                <p className="font-mono text-[15px] text-ink">
                  {formatPrice(subscribePrice(product.price))}
                </p>
              </button>
            </div>

            {/* Qty + add */}
            <div className="mt-6 flex items-center gap-3">
              <QtyStepper qty={qty} onChange={(q) => setQty(Math.max(1, q))} min={1} size="md" />
              <Button
                variant="coral"
                size="lg"
                className="flex-1"
                onClick={() => add(product.id, qty)}
              >
                Add to basket · {formatPrice(price * qty)}
              </Button>
              <button
                onClick={() => toggle(product.id)}
                aria-label={saved ? "Unsave" : "Save"}
                className="grid h-12 w-12 place-items-center rounded-full border border-ink/10 bg-white text-ink transition-all hover:-translate-y-0.5"
              >
                <Heart size={16} fill={saved ? "currentColor" : "none"} className={saved ? "text-coral" : ""} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="mt-7 grid grid-cols-3 gap-3 border-t border-ink/10 pt-6 text-center">
              <Guarantee icon={<Truck size={16} />} label="Free over ₹2,000" />
              <Guarantee icon={<Leaf size={16} />} label="Compostable pack" />
              <Guarantee icon={<Sparkles size={16} />} label="Vet-formulated" />
            </div>
          </div>

          {/* Ingredients card */}
          <div className="mt-6 rounded-lg border border-ink/10 bg-bg-tint p-8">
            <p className="mono-label">/what's inside</p>
            <h2 className="mt-2 font-serif text-[26px] italic text-ink">Ingredients</h2>
            <ul className="mt-5 space-y-2.5">
              {product.ingredients.map((ing) => (
                <li
                  key={ing}
                  className="flex items-center gap-3 border-b border-ink/10 pb-2.5 text-[14px] text-ink"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-[1400px] px-8 pb-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="mono-label">/also from the shelf</p>
            <h2 className="mt-2 font-serif text-[36px] italic text-ink">Often paired with.</h2>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} offset={i % 2 === 1 ? 24 : 0} />
          ))}
        </div>
      </section>
    </>
  );
}

function Guarantee({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-ink">{icon}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </span>
    </div>
  );
}
