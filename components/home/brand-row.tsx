import Link from "next/link";
import { brands } from "@/lib/data";

export function BrandRow() {
  return (
    <section className="mx-auto max-w-[1400px] px-8 py-16">
      <div className="rounded-lg bg-sage/60 px-10 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono-label">/the makers</p>
            <h2 className="mt-2 max-w-[20ch] font-serif text-[40px] italic leading-[1] text-ink">
              Fifteen small kitchens, studios, and mills.
            </h2>
          </div>
          <Link href="/brands" className="text-[14px] font-medium text-ink underline underline-offset-4 hover:text-coral">
            Meet them all →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {brands.map((b, i) => (
            <Link
              key={b.id}
              href={`/brand/${b.id}`}
              className="lift flex flex-col justify-between rounded-lg bg-white/90 px-5 py-6 shadow-soft-sm"
              style={{ minHeight: 180, transform: i % 2 === 1 ? "translateY(-14px)" : undefined }}
            >
              <span className="mono-label">/0{i + 1}</span>
              <div>
                <h3 className="font-serif text-[22px] italic leading-tight text-ink">{b.name}</h3>
                <p className="mt-1 text-[12px] text-ink-muted">{b.tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
