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

];

const SOCIALS = [
  { label: "Instagram", href: "#", icon: "IG" },
  { label: "Facebook", href: "#", icon: "FB" },
  { label: "Twitter", href: "#", icon: "TW" },
];

export function Footer() {
  return (
    <footer className="bg-[#3A241A] text-[#FFFCF6] border-t border-[#EAD7C2]/30">
      
      {/* Newsletter stripe */}
      <div className="border-b border-[#EAD7C2]/15">
        <div className="mx-auto max-w-[1400px] px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#C98B5A] mb-1">
              Stay in the loop 🐾
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#FFFCF6] font-display leading-tight">
              Get Pet Care Tips &amp; Exclusive Offers
            </p>
          </div>
          
          <form className="flex w-full max-w-md gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-full bg-[#FFFCF6]/10 border border-[#EAD7C2]/20 px-5 py-3 text-[14px] font-bold text-[#FFFCF6] placeholder:text-[#FFF8EC]/40 outline-none focus:border-[#C98B5A] transition-colors"
            />
            <button
              type="submit"
              className="rounded-full bg-[#C98B5A] px-6 py-3 text-[13px] font-black uppercase tracking-wider text-[#FFF8EC] hover:bg-[#4A2F22] hover:text-[#FFF8EC] transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-8 pt-14 pb-8">
        {/* Top grid */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          
          {/* Brand + about */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.webp" alt="Pet-o-philia Logo" className="h-10 w-auto object-contain" />
              <div>
                <p className="text-[22px] font-black leading-none font-display">Pet-o-philia</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C98B5A]">
                  PETS STORE
                </p>
              </div>
            </div>
            
            <p className="max-w-[36ch] text-[15px] leading-relaxed text-[#FFF8EC]/70 font-bold mb-8">
              Fun, care &amp; comfort for your fur babies — curated from small makers with big hearts.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-[#FFFCF6]/10 border border-[#EAD7C2]/20 flex items-center justify-center text-[11px] font-black text-[#FFF8EC]/60 hover:bg-[#C98B5A] hover:text-[#FFF8EC] hover:border-[#C98B5A] transition-all"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-5 text-[12px] font-black uppercase tracking-[0.14em] text-[#C98B5A]">
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[14px] font-bold text-[#FFF8EC]/60 transition-colors hover:text-[#FFFCF6]"
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
        <div className="mt-14 border-t border-[#EAD7C2]/15 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[12px] font-bold text-[#FFF8EC]/40">
            © 2024 Pet-o-philia Provisions Co. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[12px] font-bold text-[#FFF8EC]/40 hover:text-[#FFFCF6] transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[12px] font-bold text-[#FFF8EC]/40 hover:text-[#FFFCF6] transition-colors">Terms</Link>
            <Link href="/accessibility" className="text-[12px] font-bold text-[#FFF8EC]/40 hover:text-[#FFFCF6] transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
