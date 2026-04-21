"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/* Checkout / form input — oversized rounded field on warm-white surface. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-[12px] border border-line bg-white px-4 py-3.5 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-ink-muted focus:border-ink",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
