import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
  className?: string;
  large?: boolean;
}

/**
 * Pastel-stripe placeholder used site-wide in place of real photography.
 * Each product gets a deterministic angle + tint from its id.
 */
export function ProductImage({ product, className, large = false }: Props) {
  const angleSeed = [...product.id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const angle = (angleSeed % 6) * 20 + 10;

  const tone = product.tint;
  const toneDeep = shade(tone, -0.06);
  const toneLight = shade(tone, 0.1);

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{
        background: `repeating-linear-gradient(${angle}deg, ${toneLight} 0px, ${toneLight} 8px, ${tone} 8px, ${tone} 14px, ${toneDeep} 14px, ${toneDeep} 18px)`,
      }}
      aria-hidden="true"
    >
      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      {/* Shape label — top left */}
      <div
        className={cn(
          "absolute left-3 top-3 rounded-full bg-white/70 px-2.5 py-1 font-mono uppercase tracking-[0.12em] text-ink/60 backdrop-blur-sm",
          large ? "text-[11px]" : "text-[9px]",
        )}
      >
        /{product.shape}
      </div>

      {/* Product ID watermark — bottom right */}
      <div
        className={cn(
          "absolute bottom-3 right-3 font-mono uppercase tracking-[0.12em] text-ink/30",
          large ? "text-[10px]" : "text-[9px]",
        )}
      >
        {product.id.toUpperCase()}
      </div>

      {/* Center emoji icon per product shape */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          style={{ fontSize: large ? 72 : 52, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.12))" }}
        >
          {shapeEmoji(product.shape)}
        </span>
      </div>
    </div>
  );
}

function shapeEmoji(shape: string): string {
  const map: Record<string, string> = {
    pouch: "🥩",
    tin: "🥫",
    jar: "🫙",
    bed: "🛏️",
    toy: "🎾",
    stick: "🦴",
    tub: "🍦",
    tray: "🍱",
    default: "🐾",
  };
  return map[shape] ?? map.default;
}

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
