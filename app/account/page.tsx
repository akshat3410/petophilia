import Link from "next/link";
import { ProductImage } from "@/components/product/product-image";
import { products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

const ORDERS = [
  { id: "PT-04281", date: "Jun 04", status: "Out for delivery", items: ["p1", "p3"], total: 2000 },
  { id: "PT-04144", date: "May 22", status: "Delivered", items: ["p2", "p9"], total: 1760 },
  { id: "PT-04029", date: "May 03", status: "Delivered", items: ["p5"], total: 2480 },
];

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-[1200px] px-8 py-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mono-label">/your pantry · member since jun ‘24</p>
          <h1 className="mt-3 font-serif text-[72px] italic leading-[0.95] text-ink">
            Hello, June.
          </h1>
        </div>
        <div className="rounded-full bg-sage/60 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
          pantry-keeper · tier 02
        </div>
      </div>

      {/* Stat tiles */}
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {[
          { label: "Active subs", value: "2", tint: "bg-clay" },
          { label: "Orders YTD", value: "14", tint: "bg-sage" },
          { label: "Saved", value: "₹ 2,840", tint: "bg-bg-tint" },
          { label: "Points", value: "1,284", tint: "bg-clay" },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg ${s.tint} p-6`}>
            <p className="mono-label">/{s.label.toLowerCase()}</p>
            <p className="mt-3 font-serif text-[42px] italic leading-none text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Orders */}
        <div>
          <div className="flex items-end justify-between">
            <p className="mono-label">/recent orders</p>
            <Link href="#" className="text-[13px] text-ink-muted underline underline-offset-4 hover:text-coral">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {ORDERS.map((o) => (
              <li
                key={o.id}
                className="flex items-center gap-5 rounded-lg border border-ink/10 bg-white p-5"
              >
                <div className="flex gap-1.5">
                  {o.items.map((id) => {
                    const p = products.find((pp) => pp.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className="relative h-14 w-14 overflow-hidden rounded-[8px]">
                        <ProductImage product={p} />
                      </div>
                    );
                  })}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                    #{o.id} · {o.date}
                  </p>
                  <p className="mt-1 font-serif text-[18px] italic text-ink">{o.status}</p>
                </div>
                <p className="shrink-0 font-mono text-[14px] text-ink">{formatPrice(o.total)}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Active subs */}
        <aside>
          <p className="mono-label">/active subscriptions</p>
          <div className="mt-4 space-y-4">
            {[products[0], products[7]].map((p) => (
              <div key={p.id} className="rounded-lg bg-clay/50 p-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px]">
                    <ProductImage product={p} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mono-label">every 4 weeks</p>
                    <p className="mt-1 truncate text-[14px] font-medium text-ink">{p.name}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-ink-muted">
                  <span>Next · Jun 18</span>
                  <button className="text-ink underline underline-offset-4 hover:text-coral">
                    Skip · Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
