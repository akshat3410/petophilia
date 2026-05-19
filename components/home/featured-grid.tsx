import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { ProductCardServer } from "@/components/product/product-card-server";

export async function FeaturedGrid() {
  const products = await db.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      brand: { select: { name: true } },
      category: { select: { slug: true } },
    },
    orderBy: { ratingCount: "desc" },
    take: 8,
  }).catch(() => []);

  if (products.length === 0) return null;

  return (
    <section className="bg-[#FFFCF6] py-20 px-6 border-y border-[#EAD7C2]/40">
      <div className="mx-auto max-w-[1280px]">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFE8B8]/30 border border-[#CFE8B8]/60 text-[11px] font-black uppercase tracking-wider text-[#3A241A] mb-3">
              <Sparkles size={12} className="text-[#7AA95C]" />
              <span>This Week's Favorites 🐾</span>
            </div>
            <h2 className="text-4xl md:text-[44px] font-black text-[#3A241A] leading-tight font-display">
              Fresh &amp; Friendly Best Sellers
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#7A6253] font-medium max-w-[550px]">
              Restocks, fresh picks &amp; vet-approved essentials for your best buds.
            </p>
          </div>
          
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFF8EC] border border-[#EAD7C2] px-8 py-3.5 text-sm font-black text-[#4A2F22] transition-all hover:bg-[#F2DEC3]/45"
          >
            View All <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Responsive Grid */}
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
          {products.map((p) => (
            <div key={p.id} className="w-[85vw] shrink-0 snap-center sm:w-[45vw] md:w-auto">
              <ProductCardServer product={p} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFF8EC] border border-[#EAD7C2] px-8 py-3.5 text-sm font-black text-[#4A2F22]"
          >
            View All <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
