import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { CategoryStrip } from "@/components/home/category-strip";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { PromoBanner } from "@/components/home/promo-banner";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Premium Pet Supplies for Dogs & Cats — Natural Food, Toys & Vet Care",
  description:
    "Shop India's most curated pet store. Natural dog food, cat food, vet-approved supplements, toys, beds & accessories from small-batch brands. Free shipping on ₹2000+.",
  openGraph: {
    title: `${SITE_NAME} — Premium Pet Supplies for Dogs & Cats in India`,
    description:
      "India's most curated pet store. Natural food, toys, beds & vet care from small-batch brands. Free shipping on ₹2000+.",
    url: SITE_URL,
  },
  alternates: { canonical: SITE_URL },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedGrid />
      <PromoBanner />
    </>
  );
}
