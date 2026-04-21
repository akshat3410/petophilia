import { notFound } from "next/navigation";
import { products, getRelated } from "@/lib/data";
import { ProductDetail } from "@/components/product/product-detail";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default function ProductPage({ params }: PageProps) {
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();
  const related = getRelated(product.id, 4);
  return <ProductDetail product={product} related={related} />;
}
