import * as React from "react";
import { cn } from "@/lib/utils";

/* A small label badge used on icon buttons for counts (cart, wishlist). */
export function CountBadge({
  count,
  light = false,
  className,
}: {
  count: number;
  light?: boolean;
  className?: string;
}) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-medium text-white",
        light ? "bg-coral" : "bg-ink",
        "font-mono",
        className,
      )}
    >
      {count}
    </span>
  );
}
