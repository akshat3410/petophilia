import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
  className?: string;
  large?: boolean;
}

/**
 * Textured striped placeholder used site-wide in place of real product photography.
 * Deterministic — each product always renders with the same palette, angle, and label.
 */
export function ProductImage({ product, className, large = false }: Props) {
  // Deterministic angle from id so cards don't all look identical.
  const angleSeed = [...product.id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const angle = (angleSeed % 6) * 20 + 10;

  const tone = product.tint; // already a hex from data.ts
  const toneDeep = shade(tone, -0.08);
  const toneLight = shade(tone, 0.08);

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{
        background: `repeating-linear-gradient(${angle}deg, ${tone} 0px, ${tone} 6px, ${toneDeep} 6px, ${toneDeep} 9px, ${toneLight} 9px, ${toneLight} 14px)`,
      }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,0) 60%, rgba(43,43,43,0.14) 100%)",
        }}
      />
      <div
        className={cn(
          "absolute left-3 top-3 font-mono uppercase tracking-[0.14em] text-ink/60",
          large ? "text-[11px]" : "text-[9px]",
        )}
      >
        /{product.shape}
      </div>
      <div
        className={cn(
          "absolute bottom-3 right-3 font-mono uppercase tracking-[0.14em] text-ink/45",
          large ? "text-[10px]" : "text-[9px]",
        )}
      >
        {product.id.toUpperCase()}
      </div>
    </div>
  );
}

/** Tweak a hex color's lightness by pct (-1..1). Naive but good enough for placeholders. */
function shade(hex: string, pct: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  let r = (n >> 16) & 0xff;
  let g = (n >> 8) & 0xff;
  let b = n & 0xff;
  const adj = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v + (pct > 0 ? 255 - v : v) * pct)));
  r = adj(r);
  g = adj(g);
  b = adj(b);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
