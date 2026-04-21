import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const ENTRIES = [
  {
    eyebrow: "/feeding guide",
    title: "What slow-cooking actually does for your dog's bowl.",
    read: "6 min",
    tint: "bg-clay",
  },
  {
    eyebrow: "/makers",
    title: "Inside Meadowkind, the kitchen behind our best-selling pouch.",
    read: "4 min",
    tint: "bg-sage",
  },
  {
    eyebrow: "/sourcing",
    title: "Why we ask every supplier three questions about texture.",
    read: "5 min",
    tint: "bg-bg-tint",
  },
];

export function JournalPromo() {
  return (
    <section className="mx-auto max-w-[1400px] px-8 py-20">
      <div className="flex items-end justify-between">
        <div>
          <p className="mono-label">/the journal</p>
          <h2 className="mt-2 max-w-[18ch] font-serif text-[42px] italic leading-[1] text-ink">
            Reading, not shopping.
          </h2>
        </div>
        <Link href="/journal" className="text-[14px] font-medium text-ink underline underline-offset-4 hover:text-coral">
          All entries →
        </Link>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {ENTRIES.map((e, i) => (
          <Link
            key={i}
            href="/journal"
            className={`lift group flex flex-col justify-between rounded-lg ${e.tint} p-7 min-h-[260px]`}
          >
            <div className="flex items-start justify-between">
              <span className="mono-label">{e.eyebrow}</span>
              <ArrowUpRight
                size={18}
                className="text-ink-muted transition-colors group-hover:text-coral"
              />
            </div>
            <div>
              <h3 className="font-serif text-[24px] italic leading-[1.15] text-ink">{e.title}</h3>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                {e.read} read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
