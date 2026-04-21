import Link from "next/link";
import { categories } from "@/lib/data";

export function CategoryStrip() {
  return (
    <section className="mx-auto max-w-[1400px] px-8 py-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="mono-label">/shop by category</p>
          <h2 className="mt-2 font-serif text-[36px] italic text-ink">Six shelves, well-kept.</h2>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-6">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/category/${c.id}`}
            className="lift group relative flex flex-col justify-between overflow-hidden rounded-lg bg-white p-5 shadow-soft-sm"
            style={{
              minHeight: 180,
              transform: i % 2 === 1 ? "translateY(18px)" : undefined,
            }}
          >
            <span className="mono-label">/0{i + 1}</span>
            <div>
              <h3 className="font-serif text-[26px] italic leading-none text-ink">{c.label}</h3>
              <p className="mt-1 font-mono text-[11px] text-ink-muted">{c.count} items</p>
            </div>
            <span className="absolute bottom-5 right-5 text-ink-muted transition-all group-hover:translate-x-0.5 group-hover:text-coral">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
