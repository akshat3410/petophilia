import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-[1400px] px-8 py-20">
      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="mono-label">/at the counter</p>
          <h2 className="mt-2 max-w-[14ch] font-serif text-[42px] italic leading-[1] text-ink">
            A few kind words.
          </h2>
        </div>
        <div className="space-y-6">
          {testimonials.map((t, i) => (
            <figure
              key={t.who}
              className="rounded-lg border border-ink/10 bg-white px-7 py-6 shadow-soft-sm"
              style={{ transform: `rotate(${i % 2 === 0 ? -0.6 : 0.8}deg)` }}
            >
              <blockquote className="font-serif text-[22px] italic leading-[1.35] text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                  {t.who}
                </span>
                <span className="h-[1px] w-8 bg-ink/20" />
                <span className="text-[12px] text-ink-muted">{t.pet}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
