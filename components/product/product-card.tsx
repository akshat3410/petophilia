"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductImage } from "./product-image";
import { useWishlist } from "@/lib/wishlist-context";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
  offset?: number;
  className?: string;
}

export function ProductCard({ product, offset = 0, className }: Props) {
  const { has, toggle } = useWishlist();
  const saved = has(product.id);

  return (
    <article
      className={cn("group relative", className)}
      style={{ transform: offset ? `translateY(${offset}px)` : undefined }}
    >
      <Link
        href={`/product/${product.id}`}
        className="relative block overflow-hidden rounded-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-soft-md"
      >
        <div style={{ aspectRatio: "4/5" }} className="relative">
          <ProductImage product={product} />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-bg/85 text-ink backdrop-blur-sm transition-all hover:scale-110 hover:bg-bg"
          >
            <Heart
              size={15}
              strokeWidth={1.75}
              fill={saved ? "currentColor" : "none"}
              className={saved ? "text-coral" : ""}
            />
          </button>
          {product.tags[0] && (
            <span className="absolute bottom-3 left-3 rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-bg">
              {product.tags[0]}
            </span>
          )}
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <p className="mono-label">/{product.brand}</p>
          <Link href={`/product/${product.id}`}>
            <h3 className="mt-1.5 truncate text-[15px] font-medium leading-tight text-ink transition-colors hover:text-coral">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-[13px] text-ink-muted">{product.unit}</p>
        </div>
        <p className="shrink-0 font-mono text-[14px] text-ink">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
