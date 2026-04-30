import type { Metadata } from "next";
import { Nunito, Space_Mono } from "next/font/google";
import "./globals.css";
import "../styles/design-system.css";
import "../styles/hero.css";
import "../styles/product-card.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const space = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Pet-o-philia — Fun, Care & Comfort for Your Fur Babies",
  description:
    "Premium pet supplies — Grooming, Toys, Beds, Bowls & Accessories. Curated small brands, delivered with love.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${space.variable} antialiased tracking-tight`}>
      <body>
        <div className="bg-noise" />
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
