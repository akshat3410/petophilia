import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductDetail } from "@/components/product/product-detail";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const dynamicParams = true;
export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { slug: params.id },
    include: { brand: true, category: true },
  });
  if (!product) return { robots: { index: false } };

  const title = `Buy ${product.name} by ${product.brand.name}`;
  const description = `${product.shortDescription || product.name} — ${product.unit}. Rated ${product.ratingAverage}/5 by ${product.ratingCount} pet parents. Shop ${product.category.name.toLowerCase()} online at Pet-o-philia India.`;
  const url = `${SITE_URL}/product/${product.slug}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      `buy ${product.name} online`,
      product.brand.name,
      product.category.name,
      "pet supplies India",
      ...(product.tags?.split(",") || []),
    ],
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [
        {
          url: "/images/og-default.jpg",
          width: 1200,
          height: 630,
          alt: `${product.name} by ${product.brand.name} — Pet-o-philia`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-default.jpg"],
    },
    alternates: { canonical: url },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.id },
    include: { brand: true, category: true, images: true },
  });
  if (!product) notFound();

  // Related products via DB
  const relatedDb = await db.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
    include: { brand: true, category: true, images: true },
  });

  // Re-map DB product to component props type expectations
  const pMapped = {
    id: product.slug, // The component expects "id" to be the URL slug for linking
    name: product.name,
    brand: product.brand.name,
    pet: product.category.name === "Cat" ? "cat" : "dog",
    category: product.category.name,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    unit: product.unit || "",
    rating: product.ratingAverage,
    reviews: product.ratingCount,
    blurb: product.shortDescription || "",
    description: product.description || "",
    images: product.images.map(img => img.url),
    tags: product.tags?.split(",") || [],
    ingredients: [],
    tint: product.tint || "#E8DCD5"
  };

  const related = relatedDb.map(r => ({
    id: r.slug,
    name: r.name,
    brand: r.brand.name,
    pet: r.category.name === "Cat" ? "cat" : "dog",
    category: r.category.name,
    price: r.price,
    compareAtPrice: r.compareAtPrice,
    unit: r.unit || "",
    rating: r.ratingAverage,
    reviews: r.ratingCount,
    blurb: r.shortDescription || "",
    description: r.description || "",
    images: r.images.map(img => img.url),
    tags: r.tags?.split(",") || [],
    ingredients: [],
    tint: r.tint || "#E8DCD5"
  }));

  // ─── JSON-LD: Product + BreadcrumbList ────────────────────────────────────
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/product/${product.slug}`,
    name: product.name,
    description: product.shortDescription,
    url: `${SITE_URL}/product/${product.slug}`,
    image: `${SITE_URL}/images/og-default.jpg`,
    brand: {
      "@type": "Brand",
      name: product.brand.name,
    },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price / 100, // stored in paise
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.ratingAverage,
      reviewCount: product.ratingCount,
      bestRating: 5,
      worstRating: 1,
    },
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
        name: product.category.name,
        item: `${SITE_URL}/category/${product.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <Script
        id={`schema-product-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id={`schema-breadcrumb-product-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* @ts-ignore */}
      <ProductDetail product={pMapped} related={related} />
    </>
  );
}
