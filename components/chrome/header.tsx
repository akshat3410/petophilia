"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { CountBadge } from "@/components/ui/count-badge";
import { CartButton } from "@/components/cart/cart-button";
import { SearchOverlay } from "@/components/search/search-overlay";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/category/dog", label: "Dogs" },
  { href: "/category/cat", label: "Cats" },
  { href: "/category/treats", label: "Treats" },
  { href: "/vet-care", label: "Vet Care" },
  { href: "/category/home", label: "Accessories" },
  { href: "/category/toys", label: "Toys" },
  { href: "/journal", label: "Company" },
];

export function Header() {
  const { count } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <>
      {/* Announcement bar */}
      <div className="announce-bar">
        Welcome to Pet-o-philia 🐾
      </div>

      {/* Main header */}
      <motion.header 
        className="sticky top-0 z-40 shadow-soft-sm border-b border-gray-100"
        initial={{ y: -100 }}
        animate={{ 
          y: 0,
          backgroundColor: isScrolled 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(255, 255, 255, 1)',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none'
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div 
          className="mx-auto flex max-w-[1400px] items-center justify-between px-4 lg:px-6"
          animate={{ height: isScrolled ? '64px' : '80px' }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-teal text-white text-base lg:text-lg font-black">
              P
            </div>
            <div className="leading-none">
              <span className="block text-[18px] lg:text-[20px] font-black text-ink tracking-tight">
                Pet-o-philia
              </span>
              <span className="block text-[9px] lg:text-[10px] font-semibold text-teal uppercase tracking-[0.12em]">
                PETS STORE
              </span>
            </div>
          </Link>

          {/* Nav — desktop */}
          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-[14px] font-[700] text-ink-soft transition-colors hover:text-teal"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-center scale-x-0 bg-teal transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
            {/* Steal Deals pill */}
            <Link
              href="/category/treats"
              className="rounded-full bg-[#FF7A45] px-4 py-1.5 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-[#E86430] hover:shadow-md active:scale-95"
            >
              Discover Special Offers
            </Link>
          </nav>

          {/* Icons */}
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-teal/10 hover:text-teal"
            >
              <Search size={18} />
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden md:grid relative h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-teal/10 hover:text-teal"
            >
              <Heart size={18} />
              <CountBadge count={count} />
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden md:grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-teal/10 hover:text-teal"
            >
              <User size={18} />
            </Link>
            <CartButton />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ml-1 grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-teal/10 active:scale-95 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {/* Mobile Account / Wishlist */}
              <div className="flex gap-6 mb-2 pb-4 border-b border-ink/5">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-[15px] font-bold text-ink-soft hover:text-teal"
                >
                  <Heart size={18} /> Wishlist ({count})
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-[15px] font-bold text-ink-soft hover:text-teal"
                >
                  <User size={18} /> Account
                </Link>
              </div>
              {/* Main Links */}
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[15px] font-bold text-ink-soft hover:text-teal"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/category/treats"
                onClick={() => setMobileOpen(false)}
                className="inline-block w-fit rounded-full bg-[#FF7A45] px-4 py-1.5 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-[#E86430] hover:shadow-md active:scale-95"
              >
                Discover Special Offers
              </Link>
            </nav>
          </div>
        )}
      </motion.header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
