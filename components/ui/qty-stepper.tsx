"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QtyStepperProps {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
  size?: "sm" | "md";
  className?: string;
}

/* Compact +/- stepper used in the cart drawer and the PDP purchase card. */
export function QtyStepper({ qty, onChange, min = 0, size = "sm", className }: QtyStepperProps) {
  const btnSize = size === "sm" ? "h-6 w-6" : "h-10 w-10";
  const label = size === "sm" ? "text-[13px]" : "text-[15px]";
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full",
        size === "sm" ? "bg-bg p-0.5" : "border border-line p-1",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(Math.max(min, qty - 1))}
        className={cn("grid place-items-center rounded-full text-ink", btnSize)}
      >
        <Minus size={size === "sm" ? 12 : 14} />
      </button>
      <span className={cn("min-w-7 text-center font-mono", label)}>{qty}</span>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(qty + 1)}
        className={cn("grid place-items-center rounded-full text-ink", btnSize)}
      >
        <Plus size={size === "sm" ? 12 : 14} />
      </button>
    </div>
  );
}
