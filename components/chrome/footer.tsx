import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/category/dog", label: "Dogs" },
      { href: "/category/cat", label: "Cats" },
      { href: "/category/treats", label: "Treats" },
      { href: "/category/home", label: "Home" },
      { href: "/gifts", label: "Gift Cards" },
    ],
  },
  {
    title: "Care",
    links: [
      { href: "/subscribe", label: "Subscribe & Save" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Studio",
    links: [
      { href: "/about", label: "About" },
      { href: "/journal", label: "Journal" },
      { href: "/sourcing", label: "Sourcing" },
      { href: "/careers", label: "Careers" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-ink/10 bg-clay/40">
      <div className="mx-auto max-w-[1400px] px-8 pb-12 pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="mono-label">/newsletter</p>
            <h3 className="mt-4 font-serif text-[44px] italic leading-[1] text-ink">
              Letters from the pantry.
            </h3>
            <p className="mt-5 max-w-[32ch] text-[15px] leading-[1.55] text-ink-muted">
              New drops, sourcing notes, and seasonal feeding guides. One letter a month, nothing
              else.
            </p>
            <form className="mt-7 flex max-w-md items-center gap-2 rounded-full border border-ink/10 bg-white p-1.5 pl-5">
              <input
                type="email"
                placeholder="you@hearth.com"
                className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-ink-muted"
              />
              <button
                type="submit"
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-coral"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mono-label">/{col.title.toLowerCase()}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[14px] text-ink transition-colors hover:text-coral"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 overflow-hidden">
          <p className="select-none font-serif text-[min(22vw,320px)] font-light italic leading-[0.82] tracking-[-0.04em] text-ink/90">
            Petophile.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-4 border-t border-ink/10 pt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
          <span>© 2024 Petophile Provisions Co.</span>
          <span>Portland · Lisbon · Kyoto</span>
          <div className="flex gap-6">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
