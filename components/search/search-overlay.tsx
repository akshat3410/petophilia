"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ArrowUpRight } from "lucide-react";
import { products } from "@/lib/data";
import { ProductImage } from "@/components/product/product-image";
import { formatPrice } from "@/lib/utils";

const SUGGESTIONS = ["fresh food", "chicken", "calming", "dental", "wet food", "toys"];

const JOURNAL = [
  { title: "A field guide to single-protein diets", read: "6 min" },
  { title: "Why we reformulated the Hayloft Blend", read: "4 min" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-label="Search"
    >
      <div className="absolute inset-0 bg-white/95 backdrop-blur-xl" onClick={onClose} />

      <div
        className={`relative mx-auto mt-[8vh] max-w-[880px] px-8 transition-transform duration-300 ${
          open ? "translate-y-0" : "-translate-y-4"
        }`}
      >
        <div className="flex items-center gap-4 border-b border-border pb-5">
          <Search size={22} strokeWidth={1.5} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tins, toys, beds, advice..."
            className="flex-1 bg-transparent font-serif text-[32px] italic text-primary outline-none placeholder:text-muted/60"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="grid h-10 w-10 place-items-center rounded-full text-primary transition-colors hover:bg-border/30"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-8 grid gap-10 pb-8 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="mono-label">/try searching for</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-border bg-white px-3.5 py-1.5 text-[13px] text-primary transition-colors hover:border-border"
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="mt-10 mono-label">/from the journal</p>
            <ul className="mt-4 space-y-4">
              {JOURNAL.map((j) => (
                <li key={j.title}>
                  <a
                    href="#"
                    className="group flex items-start justify-between gap-4 border-b border-border pb-4"
                  >
                    <span className="block">
                      <span className="block text-[15px] leading-snug text-primary transition-colors group-hover:text-accent">
                        {j.title}
                      </span>
                      <span className="block mt-1 font-mono text-[11px] text-muted">{j.read} read</span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="mt-1 shrink-0 text-muted transition-colors group-hover:text-accent"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono-label">
              {query.trim() ? `/${results.length} products` : "/popular"}
            </p>
            <div className="mt-4 grid gap-3">
              {(query.trim() ? results : products.slice(0, 4)).map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  onClick={onClose}
                  className="group flex items-center gap-4 rounded-sm border border-transparent bg-white/40 p-3 transition-all hover:-translate-y-0.5 hover:border-border hover:bg-white hover:shadow-soft-sm"
                >
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[6px] block">
                    <ProductImage product={p} />
                  </span>
                  <span className="min-w-0 flex-1 block">
                    <span className="mono-label block">/{p.brand}</span>
                    <span className="mt-0.5 truncate text-[14px] font-medium text-primary block">{p.name}</span>
                  </span>
                  <span className="font-mono text-[13px] text-primary block">{formatPrice(p.price)}</span>
                  <ArrowUpRight
                    size={16}
                    className="text-muted opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              ))}
              {query.trim() && results.length === 0 && (
                <p className="mt-6 text-[14px] text-muted">
                  Nothing matches that — try one of the suggestions.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-5 font-mono text-[11px] text-muted">
          <span>
            <kbd className="rounded border border-border bg-white px-1.5 py-0.5">esc</kbd> close
          </span>
          <span>
            <kbd className="rounded border border-border bg-white px-1.5 py-0.5">↵</kbd> go
          </span>
        </div>
      </div>
    </div>
  );
}
