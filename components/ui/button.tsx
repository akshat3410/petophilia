"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-full font-black whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary — teal
        default:
          "bg-teal text-white shadow-teal hover:-translate-y-0.5 hover:bg-teal-deep hover:shadow-teal-hover",
        // Orange CTA
        coral:
          "bg-orange text-white shadow-orange hover:-translate-y-0.5 hover:bg-orange-deep hover:shadow-orange-hover",
        orange:
          "bg-orange text-white shadow-orange hover:-translate-y-0.5 hover:bg-orange-deep hover:shadow-orange-hover",
        teal:
          "bg-teal text-white shadow-teal hover:-translate-y-0.5 hover:bg-teal-deep hover:shadow-teal-hover",
        // Outlined
        ghost:
          "bg-transparent text-ink border-2 border-ink/20 hover:border-teal hover:text-teal",
        outline:
          "bg-transparent text-teal border-2 border-teal hover:bg-teal hover:text-white",
        // Dark
        ink: "bg-ink text-white hover:-translate-y-0.5 hover:shadow-soft-md",
        plain: "bg-transparent text-ink hover:bg-ink/5",
      },
      size: {
        default: "px-7 py-3.5 text-[15px]",
        sm: "px-4 py-2.5 text-sm",
        lg: "px-8 py-4 text-[16px]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "teal", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
