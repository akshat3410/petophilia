"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/wishlist-context";
import { products } from "@/lib/data";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <section className="mx-auto max-w-[1400px] px-8 py-14">
      <p className="mono-label">/kept close · {ids.length} items</p>
      <h1 className="mt-3 max-w-[14ch] font-serif text-[88px] italic leading-[0.95] text-ink">
        Your wishlist.
      </h1>

      {saved.length === 0 ? (
        <div className="mt-16 rounded-lg border border-dashed border-ink/20 bg-white/50 p-16 text-center">
          <p className="font-serif text-[28px] italic text-ink">Nothing kept yet.</p>
          <p className="mx-auto mt-3 max-w-[36ch] text-[14px] text-ink-muted">
            Tap the heart on anything you fancy. It'll land here, waiting patiently.
          </p>
          <Button asChild variant="coral" size="lg" className="mt-6">
            <Link href="/">Start browsing</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {saved.map((p, i) => (
            <ProductCard key={p.id} product={p} offset={i % 2 === 1 ? 24 : 0} />
          ))}
        </div>
      )}
    </section>
  );
}
