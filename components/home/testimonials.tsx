import { testimonials } from "@/lib/data";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mono-label mb-2">/ happy customers</p>
          <h2 className="text-[36px] font-black text-ink leading-tight">
            Tails are Wagging! 🐾
          </h2>
          <p className="mt-2 text-[15px] text-ink-muted font-semibold">
            Don't take our word for it — hear from our fur family.
          </p>
        </div>

        {/* Cards */}
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 scrollbar-hide md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
          {testimonials.map((t, i) => (
            <figure
              key={t.who}
              className="w-[85vw] shrink-0 snap-center rounded-2xl bg-[#E0F7FA] p-7 shadow-soft-sm md:w-auto"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={16}
                    fill="hsl(var(--orange))"
                    stroke="none"
                  />
                ))}
              </div>
              <blockquote className="text-[18px] font-bold leading-[1.4] text-ink">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-teal text-[16px] text-white font-black">
                  {t.who.charAt(0)}
                </div>
                <div>
                  <p className="text-[14px] font-black text-ink">{t.who}</p>
                  <p className="text-[12px] font-semibold text-ink-muted">{t.pet}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
