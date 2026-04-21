"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Heart, User } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { CountBadge } from "@/components/ui/count-badge";
import { CartButton } from "@/components/cart/cart-button";
import { SearchOverlay } from "@/components/search/search-overlay";

const NAV = [
  { href: "/category/dog", label: "Dogs" },
  { href: "/category/cat", label: "Cats" },
  { href: "/category/treats", label: "Treats" },
  { href: "/category/home", label: "Home" },
  { href: "/journal", label: "Journal" },
];

export function Header() {
  const { count } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-5">
          <Link href="/" className="flex items-baseline gap-1 text-ink">
            <span className="font-serif text-[28px] italic leading-none tracking-tight">
              Petophile
            </span>
            <span className="mono-label">/est.24</span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[14px] font-medium text-ink transition-colors hover:text-coral"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
            >
              <Search size={18} strokeWidth={1.75} />
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
            >
              <Heart size={18} strokeWidth={1.75} />
              <CountBadge count={count} />
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
            >
              <User size={18} strokeWidth={1.75} />
            </Link>
            <CartButton />
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
