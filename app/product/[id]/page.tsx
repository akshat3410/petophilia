import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { products, getRelated } from "@/lib/data";
import { ProductDetail } from "@/components/product/product-detail";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = products.find((p) => p.id === params.id);
  if (!product) return { robots: { index: false } };

  const title = `Buy ${product.name} by ${product.brand}`;
  const description = `${product.blurb} — ${product.unit}. Rated ${product.rating}/5 by ${product.reviews} pet parents. Shop ${product.category.toLowerCase()} for ${product.pet}s online at Pet-o-philia India.`;
  const url = `${SITE_URL}/product/${product.id}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      `buy ${product.name} online`,
      product.brand,
      `${product.brand} ${product.pet} products`,
      product.category,
      `${product.pet} ${product.category.toLowerCase()} India`,
      "pet supplies India",
      ...product.tags,
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
          alt: `${product.name} by ${product.brand} — Pet-o-philia`,
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

export default function ProductPage({ params }: PageProps) {
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();
  const related = getRelated(product.id, 4);

  // ─── JSON-LD: Product + BreadcrumbList ────────────────────────────────────
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/product/${product.id}`,
    name: product.name,
    description: product.blurb,
    url: `${SITE_URL}/product/${product.id}`,
    image: `${SITE_URL}/images/og-default.jpg`,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
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
        name: product.category,
        item: `${SITE_URL}/category/${product.pet}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/product/${product.id}`,
      },
    ],
  };

  return (
    <>
      <Script
        id={`schema-product-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id={`schema-breadcrumb-product-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetail product={product} related={related} />
    </>
  );
}
