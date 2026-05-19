import type { Metadata } from "next";
import { Nunito, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "../styles/design-system.css";
import "../styles/hero.css";
import "../styles/product-card.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";

// ─── Canonical domain (no trailing slash, no www) ───────────────────────────
const SITE_URL = "https://petophilia.in";
const SITE_NAME = "Pet-o-philia";


const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const space = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

// ─── Root metadata (inherited by all pages unless overridden) ────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pet-o-philia — Premium Pet Supplies for Dogs & Cats in India",
    template: "%s | Pet-o-philia",
  },
  description:
    "Shop premium pet supplies online in India — natural dog food, cat food, vet-approved supplements, toys, beds & accessories. Curated small brands, delivered with love.",
  keywords: [
    "pet supplies online India",
    "dog food online India",
    "cat food online",
    "buy pet accessories India",
    "vet care products for pets",
    "natural pet food",
    "organic dog treats",
    "pet beds India",
    "dog supplements",
    "cat toys online",
    "premium pet store India",
    "petophilia",
    "petophilia.in",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Pet-o-philia — Premium Pet Supplies for Dogs & Cats in India",
    description:
      "Shop premium pet supplies online — natural dog food, cat food, vet-approved supplements, toys, beds & accessories. Delivered across India with love.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Pet-o-philia — India's Premium Pet Store",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet-o-philia — Premium Pet Supplies for Dogs & Cats in India",
    description:
      "Natural dog food, cat food, vet-approved supplements, toys & more. Delivered across India.",
    images: ["/images/og-default.jpg"],
    creator: "@petophilia",
    site: "@petophilia",
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "ecommerce",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    "theme-color": "#1B9B95",
    "msapplication-TileColor": "#1B9B95",
    "google-site-verification": "REPLACE_WITH_YOUR_VERIFICATION_CODE",
  },
};

// ─── JSON-LD: Organization ───────────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icons/logo.svg`,
    width: 200,
    height: 60,
  },
  description:
    "Premium online pet store offering natural dog food, cat food, vet-approved supplements, toys, beds, and accessories across India.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.instagram.com/petophilia",
    "https://www.facebook.com/petophilia",
    "https://twitter.com/petophilia",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-1800-000-0000",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
    contactOption: "TollFree",
  },
};

// ─── JSON-LD: WebSite + Sitelinks SearchBox ──────────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Premium pet supplies for dogs and cats in India — natural food, toys, beds & vet care.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "en-IN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${nunito.variable} ${space.variable} antialiased tracking-tight`}
    >
      <body>
        {/* JSON-LD Structured Data */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <div className="bg-noise" />
        <Providers>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
