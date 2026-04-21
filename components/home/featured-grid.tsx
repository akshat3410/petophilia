import { ProductCard } from "@/components/product/product-card";
import { products } from "@/lib/data";

export function FeaturedGrid() {
  // Staggered offsets — every other column shifted down a little.
  const OFFSETS = [0, 32, 0, 48];
  const featured = products.slice(0, 8);

  return (
    <section className="mx-auto max-w-[1400px] px-8 py-20">
      <div className="flex items-end justify-between">
        <div>
          <p className="mono-label">/this week</p>
          <h2 className="mt-2 max-w-[14ch] font-serif text-[48px] italic leading-[1] text-ink">
            Considered
            <br />
            new arrivals.
          </h2>
        </div>
        <p className="hidden max-w-[32ch] text-[14px] text-ink-muted md:block">
          Restocks, reformulations, and the odd new maker we've fallen for.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
        {featured.map((p, i) => (
          <ProductCard key={p.id} product={p} offset={OFFSETS[i % OFFSETS.length]} />
        ))}
      </div>
    </section>
  );
}
