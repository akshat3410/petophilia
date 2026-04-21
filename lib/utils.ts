import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Indian number formatting, no currency symbol (we add ₹ in the component). */
export function formatINR(n: number): string {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

/** "₹1,480" */
export function formatPrice(n: number): string {
  return `₹${formatINR(n)}`;
}

/** "4.9 (1,284)" */
export function formatRating(rating: number, reviews: number): string {
  return `${rating} · ${reviews.toLocaleString("en-IN")} reviews`;
}

/** 15% subscriber discount, rounded to the rupee. */
export const SUBSCRIBE_DISCOUNT = 0.15;
export function subscribePrice(p: number): number {
  return Math.round(p * (1 - SUBSCRIBE_DISCOUNT));
}

export const FREE_SHIP_THRESHOLD = 2000;
export const STANDARD_SHIPPING = 80;

export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIP_THRESHOLD ? 0 : STANDARD_SHIPPING;
}

/** Conservative slug helper used for brand pills / category params. */
export function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
