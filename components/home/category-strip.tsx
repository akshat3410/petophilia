import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { ArrowRight, Sparkles } from "lucide-react";

// Fallback images if db image is missing
const CATEGORY_IMAGES: Record<string, string> = {
  dog: "/images/categories/dog.webp",
  cat: "/images/categories/cat.webp",
  treats: "/images/hero-pet.webp",
  "vet-care": "/images/hero-pet.webp",
  toys: "/images/hero-pet.webp",
  accessories: "/images/categories/accessories.webp",
  food: "/images/categories/food.webp",
  home: "/images/hero-pet.webp",
};

// Playful premium pastel category styling map
const CATEGORY_STYLES: Record<string, { bg: string; text: string; desc: string }> = {
  dog: { bg: "bg-[#F8D66D]/30 border-[#F8D66D]/60", text: "text-[#4A2F22]", desc: "Meals and picks for wagging tails." },
  cat: { bg: "bg-[#F7C7C9]/35 border-[#F7C7C9]/60", text: "text-[#4A2F22]", desc: "Cozy selections for picky whiskers." },
  treats: { bg: "bg-[#FFD9B7]/40 border-[#FFD9B7]/60", text: "text-[#4A2F22]", desc: "Tiny rewards for big excitement." },
  toys: { bg: "bg-[#D9C7F2]/30 border-[#D9C7F2]/60", text: "text-[#4A2F22]", desc: "For daily zoomies, chews, and chaos." },
  grooming: { bg: "bg-[#BFDDEE]/35 border-[#BFDDEE]/60", text: "text-[#4A2F22]", desc: "Fresh, fluffy, and photo-ready picks." },
  accessories: { bg: "bg-[#F7EAD8]/50 border-[#F7EAD8]/80", text: "text-[#4A2F22]", desc: "Cute, daily add-ons for walkies." },
  home: { bg: "bg-[#F7EAD8]/50 border-[#F7EAD8]/80", text: "text-[#4A2F22]", desc: "Cute, daily add-ons for home." },
};

const DEFAULT_STYLE = { bg: "bg-[#F2DEC3]/30 border-[#EAD7C2]", text: "text-[#4A2F22]", desc: "Thoughtfully selected pet picks." };

export async function CategoryStrip() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  }).catch(() => []);

  if (categories.length === 0) return null;

  return (
    <section className="bg-[#FFF8EC] py-20 px-6" id="categories">
      <div className="mx-auto max-w-[1280px]">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C98B5A]/10 border border-[#C98B5A]/25 text-[11px] font-black uppercase tracking-wider text-[#4A2F22] mb-3">
              <Sparkles size={12} className="text-[#C98B5A]" />
              <span>Shop by Mood</span>
            </div>
            <h2 className="text-4xl md:text-[44px] font-black text-[#3A241A] leading-tight font-display">
              Pick Their Favorite Corner
            </h2>
            <p className="text-[#7A6253] text-base sm:text-lg font-medium mt-3 max-w-[600px]">
              Food, toys, treats, grooming, and cozy things — sorted for every kind of pet day.
            </p>
          </div>
          
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFFCF6] border border-[#EAD7C2] px-8 py-3.5 text-sm font-black text-[#4A2F22] transition-all hover:bg-[#F7EAD8] hover:shadow-soft-sm"
          >
            All Categories <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Dynamic Pastel Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((c) => {
            const style = CATEGORY_STYLES[c.slug] || DEFAULT_STYLE;
            return (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className={`group relative flex flex-col overflow-hidden rounded-[28px] ${style.bg} border p-6 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(74,47,34,0.08)] hover:-translate-y-1`}
              >
                {/* Title & Description */}
                <div className="mb-4">
                  <h3 className="text-2xl font-black text-[#3A241A] font-display">{c.name}</h3>
                  <p className="text-xs font-bold text-[#7A6253] mt-1">{style.desc}</p>
                </div>

                {/* Object Image Crop Container */}
                <div className="relative w-full aspect-square rounded-[28px] overflow-hidden bg-white/40 border border-[#EAD7C2]/40 isolation-isolate">
                  <Image 
                    src={c.imageUrl || CATEGORY_IMAGES[c.slug] || "/images/hero-pet.webp"} 
                    alt={c.name} 
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Bottom Card Area */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-bold text-[#7A6253] bg-white/50 px-3 py-1 rounded-full border border-[#EAD7C2]/30">
                    {c._count.products} products
                  </span>
                  
                  <div className="w-9 h-9 rounded-full bg-[#FFFCF6] border border-[#EAD7C2] flex items-center justify-center text-[#4A2F22] group-hover:bg-[#4A2F22] group-hover:text-[#FFF8EC] transition-all">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
