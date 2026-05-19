import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

const ENTRIES = [
  {
    eyebrow: "Feeding Guide",
    title: "What slow-cooking actually does for your dog's bowl.",
    excerpt: "Discover how low-heat cooking preserves nutrients and improves palatability for picky eaters.",
    read: "6 min",
    color: "bg-[#F8D66D]/30 border-[#F8D66D]/50",
  },
  {
    eyebrow: "Maker Story",
    title: "Inside Meadowkind — the kitchen behind our best-selling pouch.",
    excerpt: "We visited the small-batch kitchen that makes one of our top-selling dog food lines.",
    read: "4 min",
    color: "bg-[#CFE8B8]/35 border-[#CFE8B8]/50",
  },
  {
    eyebrow: "Sourcing",
    title: "Why we ask every supplier three questions about texture.",
    excerpt: "Our sourcing standards go beyond ingredients — here is how we evaluate product quality end-to-end.",
    read: "5 min",
    color: "bg-[#FFD9B7]/40 border-[#FFD9B7]/50",
  },
];

export function JournalPromo() {
  return (
    <section className="bg-[#FFFCF6] py-20 px-6 border-t border-[#EAD7C2]/40">
      <div className="mx-auto max-w-[1280px]">
        
        {/* Header */}
        <div className="mb-14 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9C7F2]/45 border border-[#D9C7F2]/75 text-[11px] font-black uppercase tracking-wider text-[#3A241A] mb-3">
              <Sparkles size={12} className="text-[#4A2F22]" />
              <span>The Journal</span>
            </div>
            <h2 className="text-4xl md:text-[44px] font-black text-[#3A241A] font-display leading-tight">
              Pet Care Guides &amp; Tales
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#7A6253] font-medium max-w-xl">
              Thoughtful tips, stories, and healthy guides for happy tail-waggers.
            </p>
          </div>
          
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFF8EC] border border-[#EAD7C2] px-8 py-3.5 text-sm font-black text-[#4A2F22] transition-all hover:bg-[#F2DEC3]/45"
          >
            All Articles <ArrowUpRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {ENTRIES.map((e, i) => (
            <Link
              key={i}
              href="/journal"
              className="group flex flex-col overflow-hidden rounded-[28px] bg-[#FFFCF6] border border-[#EAD7C2] shadow-[0_8px_24px_rgba(74,47,34,0.04)] hover:shadow-[0_16px_40px_rgba(74,47,34,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image area */}
              <div className={`w-full h-48 ${e.color} border-b flex items-center justify-center relative overflow-hidden`}>
                <span className="text-6xl filter drop-shadow-sm select-none transform transition-transform duration-500 group-hover:scale-110">
                  {i === 0 ? "🍗" : i === 1 ? "🏡" : "🌿"}
                </span>
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-[#FFFCF6] text-[#4A2F22] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-[#EAD7C2]">
                    {e.eyebrow}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-black leading-snug text-[#3A241A] font-display mb-3 group-hover:text-[#C98B5A] transition-colors line-clamp-2">
                  {e.title}
                </h3>
                <p className="text-sm font-bold text-[#7A6253] leading-relaxed mb-6 line-clamp-2">
                  {e.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#9B8475] bg-[#F2DEC3]/25 px-2.5 py-1 rounded-full border border-[#EAD7C2]/20">
                    {e.read} read
                  </span>
                  
                  <div className="w-9 h-9 rounded-full bg-[#FFF8EC] border border-[#EAD7C2] flex items-center justify-center text-[#4A2F22] group-hover:bg-[#4A2F22] group-hover:text-[#FFF8EC] transition-all">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-10 text-center md:hidden">
          <Link href="/journal" className="inline-flex items-center gap-2 rounded-full bg-[#FFF8EC] border border-[#EAD7C2] px-8 py-3.5 text-sm font-black text-[#4A2F22]">
            All Articles <ArrowUpRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
