"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  shortDescription?: string | null;
  unit?: string | null;
  tint?: string | null;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  brand: { name: string };
  images: Array<{ url: string; alt?: string | null }>;
}

export function ProductCardServer({ product: p }: { product: DbProduct }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { data: session } = useSession();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [adding, setAdding] = useState(false);

  const wishlisted = has(p.id);
  const badge = p.isBestSeller ? "Bestseller" : p.isNewArrival ? "New" : p.isFeatured ? "Featured" : null;
  const discount = p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : null;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    setAdding(true);
    await add(p.id, 1);
    setAdding(false);
  }

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!session) {
      toast.error("Sign in to save to wishlist");
      return;
    }
    toggle(p.id);
  }

  return (
    <div
      className="flex flex-col h-full bg-[#FFFCF6] rounded-[28px] border border-[#EAD7C2] overflow-hidden shadow-[0_8px_24px_rgba(74,47,34,0.05)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(74,47,34,0.08)] hover:-translate-y-1 hover:border-[#C98B5A] relative group block animate-fade-up"
    >
      <Link href={`/product/${p.slug}`} className="absolute inset-0 z-0" aria-label={`View ${p.name}`} />
      
      {/* Playful Stickers / Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
        {badge && (
          <span className="inline-block bg-[#F8D66D] text-[#3A241A] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
            {badge}
          </span>
        )}
        {discount && (
          <span className="inline-block bg-[#D94F70] text-[#FFF8EC] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
            -{discount}%
          </span>
        )}
      </div>
 
      {/* Image Container with Soft Cream Background */}
      <div className="relative w-full aspect-[4/3] bg-[#FFF8EC] p-6 overflow-hidden flex items-center justify-center border-b border-[#EAD7C2]/40">
        {p.images[0] ? (
          <div className="relative w-full h-full">
            <Image
              src={p.images[0].url}
              alt={p.images[0].alt ?? p.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
              className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center text-4xl opacity-20 select-none">🐾</div>
        )}
 
        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-[#FFFCF6] shadow-sm border border-[#EAD7C2] transition-colors hover:bg-[#F2DEC3]/40"
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            fill={wishlisted ? "#C95C5C" : "transparent"}
            stroke={wishlisted ? "#C95C5C" : "#4A2F22"}
            className="transition-colors"
          />
        </button>
      </div>
 
      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-black uppercase tracking-widest text-[#9B8475] mb-1.5">{p.brand.name}</p>
        <h3 className="text-[17px] font-black text-[#3A241A] font-display leading-snug line-clamp-2 mb-2 flex-1 hover:text-[#C98B5A] transition-colors">{p.name}</h3>
        {p.unit && <p className="text-xs font-bold text-[#7A6253] mb-4 bg-[#F2DEC3]/30 px-3 py-1 rounded-full w-max border border-[#EAD7C2]/20">{p.unit}</p>}
 
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#EAD7C2]/50">
          <div className="flex flex-col">
            {p.compareAtPrice && (
              <span className="text-xs font-medium text-[#9B8475] line-through mb-0.5">
                {formatPrice(p.compareAtPrice)}
              </span>
            )}
            <span className="text-xl font-black text-[#3A241A] font-display">{formatPrice(p.price)}</span>
          </div>
 
          <button
            className="flex items-center justify-center w-11 h-11 rounded-full bg-[#4A2F22] text-[#FFF8EC] transition-all hover:bg-[#6B4636] hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(74,47,34,0.12)] disabled:opacity-70"
            onClick={handleAddToCart}
            disabled={adding}
            aria-label="Add to cart"
          >
            {adding ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFF8EC] border-t-transparent" />
            ) : (
              <ShoppingBag size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
