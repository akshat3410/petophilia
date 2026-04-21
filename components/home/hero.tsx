"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/product/product-image";
import { useTweaks } from "@/lib/tweaks-context";
import { products, heroFeaturedIds } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export function Hero() {
  const { tweaks } = useTweaks();
  const featured = heroFeaturedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  if (tweaks.hero === "centered") return <HeroCentered />;

  return (
    <section className="relative overflow-hidden px-8 pb-24 pt-14">
      {/* Organic blob backdrops */}
      <div
        aria-hidden
        className="blob h-[520px] w-[520px] bg-sage"
        style={{ top: "-80px", left: "-140px" }}
      />
      <div
        aria-hidden
        className="blob h-[380px] w-[380px] bg-clay"
        style={{ top: "380px", right: "8%" }}
      />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-12 gap-8">
        {/* Left: eyebrow + big display */}
        <div className="col-span-12 lg:col-span-7 lg:pt-12">
          <p className="mono-label">/a pantry for pets · chapter 04</p>
          <h1 className="mt-6 font-serif text-[92px] leading-[0.92] tracking-[-0.035em] text-ink md:text-[128px]">
            Small brands,
            <br />
            <span className="italic text-coral-deep">generously fed.</span>
          </h1>
          <p className="mt-8 max-w-[44ch] text-[17px] leading-[1.55] text-ink-soft">
            A curated pantry of fresh food, thoughtful treats, and objects with good texture —
            sourced from makers we've actually met.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild variant="coral" size="lg">
              <Link href="/category/dog">
                Shop the pantry
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/journal">Read the journal</Link>
            </Button>
          </div>

          {/* Rotated quote bubble */}
          <div
            className="mt-16 hidden max-w-[320px] rounded-lg border border-ink/10 bg-white px-5 py-4 shadow-soft-md md:block"
            style={{ transform: "rotate(-2deg)" }}
          >
            <p className="mono-label">/heard at the counter</p>
            <p className="mt-2 font-serif text-[18px] italic leading-snug text-ink">
              “Biscuit has never finished her bowl so consistently.”
            </p>
            <p className="mt-2 text-[12px] text-ink-muted">— Ama, on the Chicken & Oat</p>
          </div>
        </div>

        {/* Right: floating product cards */}
        <div className="relative col-span-12 min-h-[640px] lg:col-span-5">
          {/* Card 1 — large, top */}
          <FloatingCard
            product={featured[0]}
            size="lg"
            className="absolute right-6 top-0"
            tint="sage"
          />
          {/* Card 2 — medium, right-middle */}
          <FloatingCard
            product={featured[1]}
            size="md"
            className="absolute -left-10 top-[230px]"
            tint="clay"
            rotate={3}
          />
          {/* Card 3 — small, bottom-right */}
          <FloatingCard
            product={featured[2]}
            size="sm"
            className="absolute bottom-0 right-0"
            tint="bg-tint"
            rotate={-4}
          />
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  product,
  size,
  className,
  tint,
  rotate = 0,
}: {
  product: (typeof products)[number];
  size: "sm" | "md" | "lg";
  className?: string;
  tint: string;
  rotate?: number;
}) {
  const dims =
    size === "lg"
      ? { w: 280, h: 340 }
      : size === "md"
        ? { w: 220, h: 280 }
        : { w: 180, h: 230 };
  return (
    <Link
      href={`/product/${product.id}`}
      className={`${className} lift group block overflow-hidden rounded-lg bg-${tint} shadow-soft-md`}
      style={{
        width: dims.w,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      <div className="relative" style={{ height: dims.h }}>
        <ProductImage product={product} large={size === "lg"} />
      </div>
      <div className="flex items-center justify-between gap-3 bg-white/95 px-4 py-3">
        <div className="min-w-0">
          <p className="mono-label">/{product.brand}</p>
          <p className="mt-0.5 truncate text-[13px] font-medium text-ink">{product.name}</p>
        </div>
        <span className="shrink-0 font-mono text-[13px] text-ink">{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}

function HeroCentered() {
  return (
    <section className="relative overflow-hidden px-8 py-24 text-center">
      <div
        aria-hidden
        className="blob h-[520px] w-[520px] bg-sage"
        style={{ top: "-100px", left: "50%", transform: "translateX(-50%)" }}
      />
      <div className="relative mx-auto max-w-[1100px]">
        <p className="mono-label">/a pantry for pets · chapter 04</p>
        <h1 className="mx-auto mt-6 max-w-[18ch] font-serif text-[96px] leading-[0.92] tracking-[-0.035em] text-ink md:text-[140px]">
          Small brands, <span className="italic text-coral-deep">generously fed.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-[50ch] text-[17px] leading-[1.55] text-ink-soft">
          A curated pantry of fresh food, thoughtful treats, and objects with good texture.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild variant="coral" size="lg">
            <Link href="/category/dog">
              Shop the pantry <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/journal">Read the journal</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
