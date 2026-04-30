import Link from "next/link";
import { ArrowRight, Shield, Heart, Stethoscope, Clock, Phone, Star } from "lucide-react";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { formatPrice } from "@/lib/utils";

const SERVICES = [
  {
    icon: "🩺",
    title: "General Checkups",
    desc: "Routine wellness exams to keep your pet healthy year-round. Catch issues before they grow.",
  },
  {
    icon: "💉",
    title: "Vaccinations",
    desc: "Core and lifestyle vaccines for dogs & cats. Protect against rabies, parvo, distemper & more.",
  },
  {
    icon: "🔬",
    title: "Lab & Diagnostics",
    desc: "In-house blood panels, urinalysis, and parasite screening for fast, accurate results.",
  },
  {
    icon: "🦷",
    title: "Dental Care",
    desc: "Professional dental cleanings, extractions, and daily care products to prevent tartar buildup.",
  },
  {
    icon: "🍽️",
    title: "Nutrition Counselling",
    desc: "Vet-guided diet plans tailored to breed, age, and health conditions. Real food, real results.",
  },
  {
    icon: "🧬",
    title: "Parasite Control",
    desc: "Flea, tick, and worm prevention programs — monthly or seasonal — from trusted brands.",
  },
];

const TIPS = [
  {
    emoji: "📅",
    title: "Annual Vet Visit",
    body: "Even healthy pets need a yearly checkup. Early detection saves lives — and money.",
  },
  {
    emoji: "⚖️",
    title: "Watch Their Weight",
    body: "Over 50% of pets are overweight. Ask your vet about a feeding chart calibrated to your pet.",
  },
  {
    emoji: "🦷",
    title: "Brush Their Teeth",
    body: "Dental disease is the #1 health issue in pets. Daily brushing prevents pain and expensive procedures.",
  },
  {
    emoji: "💧",
    title: "Hydration Matters",
    body: "Cats especially are prone to under-drinking. Wet food and fountains make a real difference.",
  },
];

export default function VetCarePage() {
  // Vet products from data (filter by vet category or relevant tags)
  const vetProducts = products.filter(
    (p) =>
      p.pet === "dog" &&
      (p.category === "Vet Care" ||
        p.category === "Supplements" ||
        p.tags.some((t) =>
          ["dental", "calming", "balm", "natural", "plaque support"].includes(t.toLowerCase())
        ))
  );
  const displayProducts = vetProducts.length > 0 ? vetProducts : products.slice(0, 4);

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section
        className="relative overflow-hidden px-6 py-20"
        style={{ background: "hsl(190 72% 44%)" }}
      >
        {/* Decorative paws */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
          {["top-8 left-12", "top-16 right-24", "bottom-12 left-1/3", "bottom-8 right-8"].map(
            (pos, i) => (
              <span key={i} className={`absolute text-[64px] ${pos}`}>
                🐾
              </span>
            )
          )}
        </div>

        <div className="relative mx-auto max-w-[1400px]">
          <div className="max-w-[620px]">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[12px] font-black uppercase tracking-widest text-white">
              🩺 Vet Care
            </p>
            <h1
              className="font-black text-white leading-[1.05]"
              style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
            >
              Your Pet's Health,{" "}
              <span style={{ color: "#FFF176" }}>Our Priority.</span>
            </h1>
            <p className="mt-5 text-[17px] font-semibold leading-relaxed text-white/80">
              Vet-approved supplements, dental care, and wellness essentials — curated from brands
              that put pet health first.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/category/vet"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-black text-white shadow-orange transition-all hover:scale-105"
                style={{ background: "hsl(var(--orange))" }}
              >
                Shop Vet Products <ArrowRight size={16} strokeWidth={3} />
              </Link>
              <a
                href="tel:+911800000000"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-7 py-3.5 text-[15px] font-black text-white transition-all hover:bg-white hover:text-teal"
                style={{ color: "white" }}
              >
                <Phone size={16} strokeWidth={2.5} /> Call a Vet
              </a>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { n: "74+", label: "Vet Products" },
              { n: "5", label: "Expert Brands" },
              { n: "4.8★", label: "Avg. Rating" },
              { n: "Free", label: "Shipping ₹2000+" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/15 px-5 py-4 text-white backdrop-blur-sm">
                <p className="text-[28px] font-black leading-none">{s.n}</p>
                <p className="mt-1 text-[13px] font-semibold text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 48 }}>
            <path d="M0,48 L0,20 Q360,0 720,20 Q1080,40 1440,20 L1440,48 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 text-center">
            <p className="mono-label mb-2">/ our expertise</p>
            <h2 className="text-[36px] font-black text-ink leading-tight">
              Complete Care, All in One Place 🏥
            </h2>
            <p className="mt-2 text-[15px] font-semibold text-ink-muted">
              From preventive wellness to specialised treatments.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-teal/15 bg-white p-7 shadow-soft-sm transition-all hover:border-teal/40 hover:shadow-soft-md"
              >
                <span className="text-[40px]">{s.icon}</span>
                <h3 className="mt-4 text-[18px] font-black text-ink group-hover:text-teal transition-colors">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] font-semibold leading-relaxed text-ink-muted">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Health Tips ── */}
      <section className="bg-sand px-6 py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 text-center">
            <p className="mono-label mb-2">/ vet tips</p>
            <h2 className="text-[36px] font-black text-ink leading-tight">
              Quick Health Tips 💡
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TIPS.map((t) => (
              <div key={t.title} className="rounded-2xl bg-white p-6 shadow-soft-sm">
                <span className="text-[36px]">{t.emoji}</span>
                <h3 className="mt-3 text-[16px] font-black text-ink">{t.title}</h3>
                <p className="mt-2 text-[13px] font-semibold leading-relaxed text-ink-muted">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Vet Products ── */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mono-label mb-2">/ vet essentials</p>
              <h2 className="text-[36px] font-black text-ink leading-tight">
                Vet-Approved Products 🛡️
              </h2>
              <p className="mt-2 text-[15px] font-semibold text-ink-muted">
                Supplements, dental care & wellness — handpicked for your pet's health.
              </p>
            </div>
            <Link
              href="/category/vet"
              className="hidden items-center gap-2 rounded-full border-2 border-teal px-6 py-3 text-[14px] font-black text-teal transition-all hover:bg-teal hover:text-white md:flex"
            >
              View all <ArrowRight size={15} strokeWidth={3} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {displayProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Emergency CTA Banner ── */}
      <section className="px-6 py-12" style={{ background: "hsl(190 72% 18%)" }}>
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <p className="text-[12px] font-black uppercase tracking-widest text-teal-light mb-2">
                🚨 Emergency
              </p>
              <h2 className="text-[28px] font-black text-white leading-tight">
                Pet Emergency? We're Here 24/7.
              </h2>
              <p className="mt-2 text-[15px] font-semibold text-white/60">
                Call our vet helpline — free for all Pet-o-philia customers.
              </p>
            </div>
            <a
              href="tel:+911800000000"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-black transition-all hover:scale-105"
              style={{ color: "hsl(190 72% 36%)" }}
            >
              <Phone size={18} strokeWidth={2.5} />
              1800-000-0000 (Toll Free)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
