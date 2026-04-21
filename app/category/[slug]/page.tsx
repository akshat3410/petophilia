import { notFound } from "next/navigation";
import { categories, products } from "@/lib/data";
import { CategoryView } from "@/components/category/category-view";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}

export default function CategoryPage({ params }: PageProps) {
  const category = categories.find((c) => c.id === params.slug);
  if (!category) notFound();

  const items = products.filter(
    (p) =>
      p.pet === category.id ||
      p.category.toLowerCase().includes(category.id) ||
      p.tags.some((t) => t.toLowerCase().includes(category.id)),
  );
  const list = items.length > 0 ? items : products;

  return <CategoryView category={category} products={list} />;
}
