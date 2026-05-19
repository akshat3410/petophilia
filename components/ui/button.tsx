"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary-dark shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5",
        primary:
          "bg-primary text-white hover:bg-primary-dark shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5",
        secondary:
          "bg-white text-primary border border-border hover:bg-ice shadow-soft-sm",
        accent:
          "bg-accent text-white hover:bg-[#128a96] shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5",
        offer:
          "bg-offer text-white hover:bg-[#E55A3D] shadow-soft-sm hover:-translate-y-0.5",
        ghost:
          "bg-transparent text-primary hover:bg-ice",
        outline:
          "bg-transparent text-primary border border-border hover:bg-ice",
        ink: 
          "bg-primary text-white hover:-translate-y-0.5 hover:shadow-soft-md",
        plain: 
          "bg-transparent text-muted hover:text-primary hover:bg-ice",
        coral:
          "bg-offer text-white hover:bg-[#E55A3D] shadow-soft-sm hover:-translate-y-0.5",
        orange:
          "bg-offer text-white hover:bg-[#E55A3D] shadow-soft-sm hover:-translate-y-0.5",
        teal:
          "bg-accent text-white hover:bg-[#128a96] shadow-soft-sm hover:-translate-y-0.5",
      },
      size: {
        default: "px-7 py-3.5 text-[15px]",
        sm: "px-4 py-2.5 text-sm",
        lg: "px-8 py-4 text-[16px]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
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
