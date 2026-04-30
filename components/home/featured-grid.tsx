import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export function FeaturedGrid() {
  const featured = products.slice(0, 8);

  return (
    <section className="bg-white py-16 px-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Section header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mono-label mb-2">/ this week</p>
            <h2 className="text-[36px] font-black text-ink leading-tight">
              New Arrivals 🐾
            </h2>
            <p className="mt-2 text-[15px] text-ink-muted font-semibold">
              Restocks, fresh picks & small-batch makers.
            </p>
          </div>
          <Link
            href="/category/dog"
            className="hidden items-center gap-2 rounded-full border-2 border-teal px-6 py-3 text-[14px] font-black text-teal transition-all hover:bg-teal hover:text-white md:flex"
          >
            View all <ArrowRight size={15} strokeWidth={3} />
          </Link>
        </div>

        {/* Product grid */}
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
          {featured.map((p) => (
            <div key={p.id} className="w-[80vw] shrink-0 snap-center sm:w-[45vw] md:w-auto">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Mobile view-all */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/category/dog"
            className="inline-flex items-center gap-2 rounded-full border-2 border-teal px-6 py-3 text-[14px] font-black text-teal"
          >
            View all <ArrowRight size={15} strokeWidth={3} />
          </Link>
        </div>
      </div>
    </section>
  );
}
