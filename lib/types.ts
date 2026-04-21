export type PackageShape =
  | "pouch"
  | "tin"
  | "jar"
  | "bed"
  | "toy"
  | "stick"
  | "tub"
  | "tray";

export type Pet = "dog" | "cat";

export interface Category {
  id: string;
  label: string;
  count: number;
}

export interface Brand {
  id: string;
  name: string;
  tag: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  pet: Pet;
  category: string;
  price: number; // stored as INR, integer
  unit: string;
  rating: number;
  reviews: number;
  tags: string[];
  blurb: string;
  ingredients: string[];
  tint: string;
  shape: PackageShape;
}

export interface Testimonial {
  quote: string;
  who: string;
  pet: string;
}

export interface CartItem {
  id: string;
  qty: number;
}

/* Tweakable design preferences — persisted to localStorage */
export interface TweakState {
  mood: "sage" | "dusk" | "mineral" | "honey";
  density: "cozy" | "default" | "roomy";
  hero: "asymmetric" | "centered";
  viewport: "desktop" | "mobile";
}

/* App routes used across the prototype. Next.js handles real routes now
   via the app/ folder, but we keep the union type for navigational helpers
   (e.g. a footer link that wants to send the user to /shop). */
export type RouteKey =
  | "home"
  | "category"
  | "product"
  | "cart"
  | "checkout"
  | "dashboard"
  | "wishlist"
  | "thank-you";
