import { Hero } from "@/components/home/hero";
import { CategoryStrip } from "@/components/home/category-strip";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { BrandRow } from "@/components/home/brand-row";
import { Testimonials } from "@/components/home/testimonials";
import { JournalPromo } from "@/components/home/journal-promo";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedGrid />
      <BrandRow />
      <Testimonials />
      <JournalPromo />
    </>
  );
}
