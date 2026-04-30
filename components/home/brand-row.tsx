import Link from "next/link";
import { brands } from "@/lib/data";

export function BrandRow() {
  return (
    <section className="bg-sand py-16 px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 text-center">
          <p className="mono-label mb-2">/ our makers</p>
          <h2 className="text-[36px] font-black text-ink leading-tight">
            Small Kitchens, Big Love 🏡
          </h2>
          <p className="mt-2 text-[15px] text-ink-muted font-semibold">
            Brands we've actually met — sourced with care, restocked with intent.
          </p>
        </div>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 scrollbar-hide sm:grid sm:grid-cols-2 md:grid-cols-5 md:overflow-visible md:pb-0">
          {brands.map((b, i) => (
            <Link
              key={b.id}
              href={`/brand/${b.id}`}
              className="lift group flex w-[70vw] shrink-0 snap-center flex-col gap-4 rounded-2xl bg-white p-6 shadow-soft-sm sm:w-auto"
            >
              {/* Numbered icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
                <span className="text-[13px] font-black">/0{i + 1}</span>
              </div>
              <div>
                <h3 className="text-[18px] font-black text-ink group-hover:text-teal transition-colors">
                  {b.name}
                </h3>
                <p className="mt-1 text-[12px] font-semibold text-ink-muted">{b.tag}</p>
              </div>
              <span className="mt-auto text-teal font-bold text-[13px] group-hover:translate-x-1 transition-transform inline-block">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
