"use client";

import { useMemo, useState } from "react";
import { Pill } from "@/components/ui/pill";
import { ProductCard } from "@/components/product/product-card";
import type { Category, Product } from "@/lib/types";
import { brands } from "@/lib/data";
import { formatINR } from "@/lib/utils";

const SORTS = ["Editor's pick", "Newest", "Price · low", "Price · high"] as const;

interface Props {
  category: Category;
  products: Product[];
}

export function CategoryView({ category, products }: Props) {
  const [brand, setBrand] = useState<string | null>(null);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Editor's pick");

  const filtered = useMemo(() => {
    let list = products.slice();
    if (brand) list = list.filter((p) => p.brand === brand);
    switch (sort) {
      case "Price · low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "Price · high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "Newest":
        list.reverse();
        break;
    }
    return list;
  }, [products, brand, sort]);

  const OFFSETS = [0, 32, 0, 48];

  return (
    <>
      {/* Header band */}
      <section className="relative overflow-hidden border-b border-accent/15 bg-surface px-8 py-16">
        <div
          aria-hidden
          className="blob h-[320px] w-[320px] bg-accent/20"
          style={{ top: "-60px", right: "-60px" }}
        />
        <div className="relative mx-auto max-w-[1400px]">
          <p className="mono-label">/the pantry · category</p>
          <h1 className="mt-4 font-serif text-[88px] italic leading-[0.95] tracking-[-0.035em] text-primary md:text-[112px]">
            {category.label}.
          </h1>
          <p className="mt-4 max-w-[44ch] text-[16px] text-muted">
            {formatINR(category.count)} considered picks, vetted by the counter and restocked weekly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-8 py-12">
        {/* Floating filter panel */}
        <div className="sticky top-[84px] z-30 -mx-4 mb-10 rounded-full border border-accent/20 bg-white/95 px-4 py-3 shadow-soft-sm backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-3">
            <span className="mono-label shrink-0">/brand</span>
            <div className="flex flex-wrap gap-2">
              <Pill active={brand === null} onClick={() => setBrand(null)}>
                All
              </Pill>
              {brands.map((b) => (
                <Pill key={b.id} active={brand === b.name} onClick={() => setBrand(b.name)}>
                  {b.name}
                </Pill>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="mono-label">/sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm text-primary outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} offset={OFFSETS[i % OFFSETS.length]} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-muted">
            Nothing in stock under these filters. Try clearing brand.
          </p>
        )}
      </section>
    </>
  );
}
