"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { Search, Heart, User, LogOut, Settings, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
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
];

export function Header() {
  const { count } = useWishlist();
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Announcement Bar: Cocoa Background, Cream Text */}
      <div className="bg-[#4A2F22] text-[#FFF8EC] text-center text-xs font-semibold tracking-wide py-2.5 px-6 border-b border-[#EAD7C2]/30">
        🐾 <span className="font-bold text-butter">Free shipping</span> on orders over ₹999 — Premium quality, delivered with care.
        <span className="ml-3 hidden sm:inline text-butter font-bold underline cursor-pointer">Shop Now →</span>
      </div>

      {/* Main Header: Warm Off-White (#FFFCF6) */}
      <motion.header 
        className="sticky top-0 z-40 border-b border-[#EAD7C2] bg-[#FFFCF6]"
        initial={{ y: -100 }}
        animate={{ 
          y: 0,
          backgroundColor: isScrolled 
            ? 'rgba(255, 252, 246, 0.95)' 
            : 'rgba(255, 252, 246, 1)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none'
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
            <img src="/logo.webp" alt="Pet-o-philia Logo" className="h-8 lg:h-9 w-auto object-contain" />
            <span className="block leading-none">
              <span className="block text-[18px] lg:text-[20px] font-black text-[#3A241A] tracking-tight font-display">
                Pet-o-philia
              </span>
              <span className="block text-[9px] lg:text-[10px] font-bold text-[#C98B5A] uppercase tracking-[0.12em]">
                PETS STORE
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-[14px] font-[700] text-[#7A6253] transition-colors hover:text-[#3A241A]"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-center scale-x-0 bg-[#C98B5A] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
            
            {/* Playful Steal Deals Button */}
            <Link
              href="/category/treats"
              className="rounded-full bg-[#4A2F22] px-5 py-2 text-[13px] font-bold text-[#FFF8EC] shadow-soft-sm transition-all hover:bg-[#6B4636] hover:shadow-soft-md active:scale-95"
            >
              Shop Treats
            </Link>
          </nav>

          {/* Icons Area */}
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full text-[#3A241A] transition-colors hover:bg-[#F2DEC3]/40 hover:text-[#C98B5A]"
            >
              <Search size={18} />
            </button>
            
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden md:grid relative h-10 w-10 place-items-center rounded-full text-[#3A241A] transition-colors hover:bg-[#F2DEC3]/40 hover:text-[#C98B5A]"
            >
              <Heart size={18} />
              <CountBadge count={count} />
            </Link>

            <div className="relative hidden md:block">
              {session ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="User menu"
                    className="grid h-10 w-10 place-items-center rounded-full bg-[#F2DEC3]/50 text-[#4A2F22] transition-colors hover:bg-[#C98B5A] hover:text-[#FFF8EC]"
                  >
                    <span className="text-sm font-bold">
                      {session.user.name?.[0]?.toUpperCase() ?? <User size={18} />}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-12 z-50 min-w-[180px] rounded-xl border border-[#EAD7C2] bg-[#FFFCF6] p-2 shadow-soft-lg"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <p className="px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#7A6253]">
                        {session.user.name}
                      </p>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#3A241A] hover:bg-[#F2DEC3]/40 hover:text-[#C98B5A]"
                      >
                        <User size={14} /> My Account
                      </Link>
                      {session.user.role === "ADMIN" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#3A241A] hover:bg-[#F2DEC3]/40 hover:text-[#C98B5A]"
                        >
                          <Settings size={14} /> Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-[#EAD7C2]" />
                      <button
                        onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#3A241A] hover:bg-[#C95C5C]/10 hover:text-[#C95C5C]"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  aria-label="Account"
                  className="grid h-10 w-10 place-items-center rounded-full text-[#3A241A] transition-colors hover:bg-[#F2DEC3]/40 hover:text-[#C98B5A]"
                >
                  <User size={18} />
                </Link>
              )}
            </div>
            
            <CartButton />

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ml-1 grid h-10 w-10 place-items-center rounded-full text-[#3A241A] transition-colors hover:bg-[#F2DEC3]/40 active:scale-95 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Nav Drawer: GPU-accelerated smooth slide overlay without layout shifts */}
        <div 
          className={`absolute left-0 right-0 top-full border-t border-[#EAD7C2] bg-[#FFFCF6] px-6 py-6 shadow-soft-lg transition-all duration-300 ease-in-out lg:hidden origin-top z-40 ${
            mobileOpen 
              ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col gap-4">
            {/* Mobile Account / Wishlist with touch-friendly sizes */}
            <div className="flex gap-6 mb-2 pb-4 border-b border-[#EAD7C2]">
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-[15px] font-bold text-[#3A241A] hover:text-[#C98B5A] py-2"
              >
                <Heart size={18} /> Wishlist ({count})
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-[15px] font-bold text-[#3A241A] hover:text-[#C98B5A] py-2"
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
                className="text-[15px] font-bold text-[#3A241A] hover:text-[#C98B5A] py-1.5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/category/treats"
              onClick={() => setMobileOpen(false)}
              className="inline-block w-fit rounded-full bg-[#4A2F22] px-6 py-3 text-[13px] font-bold text-[#FFF8EC] shadow-soft-sm transition-all hover:bg-[#6B4636] active:scale-95 mt-2"
            >
              Shop Treats
            </Link>
          </nav>
        </div>
      </motion.header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
