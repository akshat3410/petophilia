import type { MetadataRoute } from "next";

const SITE_URL = "https://petophilia.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account/",
          "/checkout/",
          "/api/",
          "/_next/",
          "/search?",
        ],
      },
      // Allow Google to crawl everything important
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/account/",
          "/checkout/",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
