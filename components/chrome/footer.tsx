import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/category/dog", label: "Dogs" },
      { href: "/category/cat", label: "Cats" },
      { href: "/category/treats", label: "Treats" },
      { href: "/category/home", label: "Accessories" },
      { href: "/category/toys", label: "Toys" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/subscribe", label: "Subscribe & Save" },
      { href: "/shipping", label: "Shipping Info" },
      { href: "/returns", label: "Returns" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/journal", label: "Journal" },
      { href: "/sourcing", label: "Our Sourcing" },
      { href: "/careers", label: "Careers" },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ background: "hsl(190 72% 18%)" }} className="text-white">
      <div className="mx-auto max-w-[1400px] px-8 pt-16 pb-8">
        {/* Top grid */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal text-white text-lg font-black">
                P
              </div>
              <div>
                <p className="text-[22px] font-black leading-none">Pet-o-philia</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-light opacity-80">
                  PETS STORE
                </p>
              </div>
            </div>
            <p className="max-w-[36ch] text-[15px] leading-relaxed text-white/70 font-semibold">
              Fun, care &amp; comfort for your fur babies — curated from small makers with big hearts.
            </p>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-[13px] font-black uppercase tracking-widest text-teal-light mb-3">
                Stay in the loop 🐾
              </p>
              <form className="flex max-w-sm items-end gap-2 border-b-2 border-white/20 pb-1">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent py-2 text-[14px] font-semibold text-white placeholder:text-white/40 outline-none"
                />
                <button
                  type="submit"
                  className="text-[13px] font-black uppercase tracking-widest text-teal hover:text-white transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-5 text-[12px] font-black uppercase tracking-[0.14em] text-teal-light">
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[14px] font-semibold text-white/60 transition-colors hover:text-white"
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

        {/* Divider */}
        <div className="mt-14 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[12px] font-semibold text-white/40">
            © 2024 Pet-o-philia Provisions Co. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[12px] font-semibold text-white/40 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[12px] font-semibold text-white/40 hover:text-white transition-colors">Terms</Link>
            <Link href="/accessibility" className="text-[12px] font-semibold text-white/40 hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
