# Petophile

A curated marketplace of small, thoughtful pet brands — the Next.js codebase.

## Run it

```bash
npm install
npm run dev
```

Opens on http://localhost:3000.

## Stack

- Next.js 14 · App Router · React 18 · TypeScript
- Tailwind CSS · CSS variable tokens · `data-mood`/`data-density` overrides
- Radix primitives for dialog/slot · `lucide-react` icons
- State: React Context (cart, wishlist, tweaks) with `localStorage` persistence

## Fonts

Loaded via `next/font/google`: **Fraunces** (display), **Geist** (body), **JetBrains Mono** (labels). Tailwind families `font-serif`, `font-sans`, `font-mono`.

## Design tokens

Declared as HSL in `app/globals.css` on `:root`. Tweakable moods swap the key hues via `[data-mood="..."]` scopes. All color utilities go through `hsl(var(--token) / <alpha>)`, so alpha-aware classes like `bg-coral/40` work.

Core palette:
- `bg` — warm white
- `sage` / `sage-deep` — dusty sage
- `clay` / `clay-deep` — clay beige
- `coral` / `coral-deep` — muted coral (CTA only)
- `ink` / `ink-soft` / `ink-muted` — neutrals

## Routes

| Path | File |
|---|---|
| `/` | `app/page.tsx` — hero, categories, featured grid, brands, testimonials, journal |
| `/category/[slug]` | `app/category/[slug]/page.tsx` — PLP with sticky floating filter bar |
| `/product/[id]` | `app/product/[id]/page.tsx` — PDP: sticky gallery + floating purchase card |
| `/checkout` | `app/checkout/page.tsx` — 3-step single column + summary |
| `/account` | `app/account/page.tsx` — dashboard with stat tiles, orders, subs |
| `/wishlist` | `app/wishlist/page.tsx` — saved items grid |

## Global overlays

- **Cart drawer** (`components/cart/cart-drawer.tsx`) — slide-in, free-shipping progress, upsell row
- **Search overlay** (`components/search/search-overlay.tsx`) — full-screen predictive search with journal + suggestions
- **Tweaks panel** (`components/tweaks/tweaks-panel.tsx`) — floating knobs for mood / density / hero / viewport

All three live in `components/providers.tsx` alongside the context providers.

## Data

`lib/data.ts` — hand-authored sample data (12 products, 5 brands, 6 categories, testimonials). Replace with your real data layer; the component surfaces types in `lib/types.ts`.

## Placeholders

`components/product/product-image.tsx` renders a deterministic textured stripe pattern per product, labeled with its shape (e.g. `/pouch`) and SKU. Replace with `<Image />` + real photography in production.

## Logo

An early-stage logo exploration lives alongside in `logo/` (as a standalone HTML artifact) — five directions evolving from the existing paw-and-heart badge.
