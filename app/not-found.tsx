import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist. Browse our pet supplies collection.",
  robots: {
    index: false,
    follow: false,
  },
};

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6"
      style={{ background: "hsl(190 72% 44%)" }}
    >
      <p className="text-[120px] font-black leading-none text-white/20" aria-hidden="true">404</p>
      <h1 className="text-[32px] font-black text-white text-center">
        Oops! This page ran off the leash 🐕
      </h1>
      <p className="text-[16px] font-semibold text-white/70 text-center max-w-[40ch]">
        We couldn't find the page you were looking for. It may have moved or never existed.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-black text-accent shadow-soft-lg transition-all hover:scale-105 active:scale-95"
        style={{ color: "hsl(190 72% 36%)" }}
      >
        🏠 Back to Home
      </Link>
    </div>
  );
}
