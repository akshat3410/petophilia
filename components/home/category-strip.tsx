import Link from "next/link";
import { categories } from "@/lib/data";

const ICONS: Record<string, string> = {
  dog: "/icons/dog.svg",
  cat: "/icons/cat.svg",
  treats: "/icons/treats.svg",
  vet: "/icons/vet.svg",
  toys: "/icons/toys.svg",
  home: "/icons/home.svg",
};

const COLORS = [
  "bg-[#E0F7FA]",
  "bg-[#FFF9C4]",
  "bg-[#FCE4EC]",
  "bg-[#E8F5E9]",
  "bg-[#EDE7F6]",
  "bg-[#FFF3E0]",
];

export function CategoryStrip() {
  return (
    <section className="bg-sand py-14 px-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mono-label mb-2">/ shop by category</p>
          <h2 className="text-[36px] font-black text-ink leading-tight">
            What are you shopping for?
          </h2>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className={`lift group flex flex-col items-center justify-center gap-3 rounded-2xl ${COLORS[i % COLORS.length]} py-8 px-4 text-center shadow-soft-sm`}
            >
              <img src={ICONS[c.id]} alt={c.label} className="h-12 w-12 transition-transform group-hover:scale-110" />
              <div>
                <h3 className="text-[16px] font-black text-ink">{c.label}</h3>
                <p className="text-[11px] font-semibold text-ink-muted">{c.count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
