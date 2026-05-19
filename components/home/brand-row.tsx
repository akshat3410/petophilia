import Link from "next/link";
import { db } from "@/lib/db";
import { Sparkles } from "lucide-react";

export async function BrandRow() {
  const brands = await db.brand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    take: 5,
  }).catch(() => []);

  if (brands.length === 0) return null;

  return (
    <section className="bg-[#FFF8EC] py-20 px-6 border-t border-[#EAD7C2]/40">
      <div className="mx-auto max-w-[1280px]">
        
        {/* Section Title */}
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BFDDEE]/40 border border-[#BFDDEE]/70 text-[11px] font-black uppercase tracking-wider text-[#3A241A] mb-3">
            <Sparkles size={12} className="text-[#4A2F22]" />
            <span>Our Partners</span>
          </div>
          <h2 className="text-4xl md:text-[44px] font-black text-[#3A241A] font-display leading-tight">
            Premium Brands You Trust
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#7A6253] font-medium max-w-2xl mx-auto">
            Curated from small-batch makers and industry leaders — sourced with care, selected for quality.
          </p>
        </div>

        {/* Scrollable / Grid Cards */}
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 scrollbar-hide sm:grid sm:grid-cols-2 md:grid-cols-5 md:overflow-visible md:pb-0">
          {brands.map((b, i) => (
            <Link
              key={b.id}
              href={`/brand/${b.slug}`}
              className="group flex w-[75vw] shrink-0 snap-center flex-col gap-5 rounded-[28px] bg-[#FFFCF6] border border-[#EAD7C2] p-8 shadow-[0_8px_24px_rgba(74,47,34,0.04)] sm:w-auto hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(74,47,34,0.08)] hover:border-[#C98B5A] transition-all duration-300"
            >
              {b.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.logoUrl} alt={b.name} className="h-12 w-auto object-contain mix-blend-multiply" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2DEC3]/40 text-[#4A2F22] group-hover:bg-[#C98B5A] group-hover:text-[#FFF8EC] transition-all">
                  <span className="text-sm font-black tracking-widest">0{i + 1}</span>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-black text-[#3A241A] font-display group-hover:text-[#C98B5A] transition-colors">
                  {b.name}
                </h3>
                <p className="mt-1.5 text-xs font-bold text-[#7A6253] line-clamp-2">
                  {b.tagline ?? "Premium pet nutrition"}
                </p>
              </div>
              
              <span className="mt-auto text-[#C98B5A] font-black text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore <span>→</span>
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
