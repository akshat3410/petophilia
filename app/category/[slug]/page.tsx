import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { categories, products } from "@/lib/data";
import { CategoryView } from "@/components/category/category-view";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = categories.find((c) => c.id === params.slug);
  if (!category) return { robots: { index: false } };

  const title = `${category.label} Products — Shop ${category.count}+ Items`;
  const description = `Browse ${category.count}+ premium ${category.label.toLowerCase()} products at Pet-o-philia. Curated natural pet food, accessories & vet-approved care — delivered across India. Free shipping on ₹2000+.`;
  const url = `${SITE_URL}/category/${category.id}`;

  return {
    title,
    description,
    keywords: [
      `${category.label.toLowerCase()} products India`,
      `buy ${category.label.toLowerCase()} online India`,
      `best ${category.label.toLowerCase()} products`,
      `${category.label.toLowerCase()} accessories online`,
      "pet store India",
      "petophilia.in",
    ],
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: url },
  };
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

  // ─── JSON-LD: ItemList + BreadcrumbList ───────────────────────────────────
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.label} Supplies`,
    description: `Shop ${category.label.toLowerCase()} products at Pet-o-philia`,
    url: `${SITE_URL}/category/${category.id}`,
    numberOfItems: list.length,
    itemListElement: list.slice(0, 10).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/product/${p.id}`,
      name: p.name,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.label,
        item: `${SITE_URL}/category/${category.id}`,
      },
    ],
  };

  return (
    <>
      <Script
        id={`schema-category-${category.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Script
        id={`schema-breadcrumb-category-${category.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoryView category={category} products={list} />
    </>
  );
}
