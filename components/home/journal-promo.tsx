import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const ENTRIES = [
  {
    eyebrow: "Feeding Guide",
    emoji: "🍗",
    title: "What slow-cooking actually does for your dog's bowl.",
    read: "6 min",
    bg: "bg-[#E0F7FA]",
    accent: "text-teal",
  },
  {
    eyebrow: "Maker Story",
    emoji: "🏡",
    title: "Inside Meadowkind — the kitchen behind our best-selling pouch.",
    read: "4 min",
    bg: "bg-[#FFF9C4]",
    accent: "text-[#F59F00]",
  },
  {
    eyebrow: "Sourcing",
    emoji: "🌿",
    title: "Why we ask every supplier three questions about texture.",
    read: "5 min",
    bg: "bg-[#FCE4EC]",
    accent: "text-[#E91E63]",
  },
];

export function JournalPromo() {
  return (
    <section className="bg-sand py-16 px-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mono-label mb-2">/ the journal</p>
            <h2 className="text-[36px] font-black text-ink leading-tight">
              Good Reads for Pet Parents 📖
            </h2>
          </div>
          <Link
            href="/journal"
            className="hidden items-center gap-2 text-[14px] font-black text-teal underline underline-offset-4 hover:text-teal-deep md:flex"
          >
            All entries →
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {ENTRIES.map((e, i) => (
            <Link
              key={i}
              href="/journal"
              className={`lift group flex flex-col justify-between rounded-2xl ${e.bg} p-7 min-h-[240px] shadow-soft-sm`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[32px]">{e.emoji}</span>
                  <p className={`mt-2 text-[11px] font-black uppercase tracking-widest ${e.accent}`}>
                    {e.eyebrow}
                  </p>
                </div>
                <ArrowUpRight
                  size={20}
                  className="text-ink/30 transition-colors group-hover:text-ink"
                />
              </div>
              <div>
                <h3 className="text-[18px] font-black leading-snug text-ink">
                  {e.title}
                </h3>
                <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                  {e.read} read
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/journal" className="text-[14px] font-black text-teal underline underline-offset-4">
            All entries →
          </Link>
        </div>
      </div>
    </section>
  );
}
