"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/* A glass "pill" button used for category/pet filters across the app. */
export const Pill = React.forwardRef<HTMLButtonElement, PillProps>(
  ({ className, active, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
        active
          ? "border-teal bg-teal text-white"
          : "border-line bg-white/70 text-ink backdrop-blur-md hover:-translate-y-px hover:bg-white hover:shadow-soft-sm",
        className,
      )}
      {...props}
    />
  ),
);
Pill.displayName = "Pill";
