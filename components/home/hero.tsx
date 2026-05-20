"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

/* ─── Slide Data ────────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    badge: "Fresh picks for happy pets 🐾",
    headline: (
      <>
        Good Stuff for <br />
        <span className="text-[#C98B5A] font-display italic">Very Good Pets</span>
      </>
    ),
    subheading: "Shop food, toys, treats, grooming, and everyday essentials chosen for pets who deserve the good stuff.",
    primaryCta: "Shop the Good Stuff",
    secondaryCta: "Explore Categories",
    image: "/images/hero/slide1.webp",
  },
  {
    id: 2,
    badge: "Mealtime made better 🍽️",
    headline: (
      <>
        Better Food, <br />
        <span className="text-[#7AA95C] font-display italic">Happier Tails</span>
      </>
    ),
    subheading: "Find trusted meals, snacks, and wellness picks for dogs and cats of every age.",
    primaryCta: "Browse Food & Treats",
    secondaryCta: "View Best Sellers",
    image: "/images/hero/slide2.webp",
  },
  {
    id: 3,
    badge: "Playtime favorites 🧸",
    headline: (
      <>
        Toys, Treats & <br />
        <span className="text-[#D94F70] font-display italic">Tiny Joys</span>
      </>
    ),
    subheading: "From chew toys to cozy accessories, discover little things that make every pet day brighter.",
    primaryCta: "Shop New Toys",
    secondaryCta: "See Deals",
    image: "/images/hero/slide3.webp",
  },
  {
    id: 4,
    badge: "Grooming & Pampering 🧼",
    headline: (
      <>
        Fluffy, Fresh & <br />
        <span className="text-[#4A2F22] font-display italic">Photo-Ready</span>
      </>
    ),
    subheading: "Vet-approved shampoos, soothing balms, and gentle brushes for a clean coat and healthy skin.",
    primaryCta: "Browse Grooming",
    secondaryCta: "Best Sellers",
    image: "/images/hero/slide4.webp",
  },
  {
    id: 5,
    badge: "Cozy Comforts 🛌",
    headline: (
      <>
        Sweet Dreams & <br />
        <span className="text-[#C98B5A] font-display italic">Soft Beds</span>
      </>
    ),
    subheading: "Orthopedic mattresses, snuggly blankets, and safe spaces designed for the ultimate beauty sleep.",
    primaryCta: "Shop Beds",
    secondaryCta: "Cozy Blankets",
    image: "/images/hero/slide5.webp",
  },
];

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const autoplay = useRef(Autoplay({ delay: 6000, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 45 },
    [autoplay.current]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi]);

  // SSR & Initial Hydration Fallback: Render static first slide for zero mismatches
  if (!mounted) {
    const firstSlide = SLIDES[0];
    return (
      <section className="relative overflow-hidden bg-[#FFFCF6] py-8 lg:py-12 px-4 sm:px-6 lg:px-8 font-sans font-medium">
        <div className="mx-auto max-w-[1320px] rounded-[36px] bg-[#FFFCF6] border border-[#EAD7C2] shadow-[0_18px_50px_rgba(74,47,34,0.06)] overflow-hidden relative min-h-[580px] lg:min-h-[640px] flex items-center">
          <div className="w-full px-6 sm:px-12 lg:px-16 py-12 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-8 z-10">
            {/* Left Column: Content */}
            <div className="w-full lg:w-[55%] flex flex-col justify-center text-left">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#4A2F22]/20 bg-[#4A2F22]/5 text-[#4A2F22] text-xs font-black uppercase tracking-wider w-max mb-6 shadow-sm">
                <Sparkles size={14} className="text-[#C98B5A]" />
                <span>{firstSlide.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-[#3A241A] leading-[1.1]">
                {firstSlide.headline}
              </h1>
              
              <p className="text-[#4A2F22]/90 text-base sm:text-lg font-medium leading-relaxed mt-6">
                {firstSlide.subheading}
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link 
                  href="/category/all" 
                  className="inline-flex items-center justify-center rounded-full bg-[#4A2F22] px-8 py-4 text-base font-black text-[#FFF8EC] shadow-[0_10px_20px_rgba(74,47,34,0.12)] hover:bg-[#3A241A] hover:-translate-y-0.5 transition-all duration-300"
                >
                  {firstSlide.primaryCta}
                </Link>
                <Link 
                  href="/#categories" 
                  className="inline-flex items-center justify-center rounded-full bg-white/60 border border-[#4A2F22]/30 px-8 py-4 text-base font-black text-[#4A2F22] shadow-sm hover:bg-[#4A2F22]/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {firstSlide.secondaryCta}
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-5 pt-6 border-t border-[#4A2F22]/10">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="relative w-8 h-8 rounded-full border-2 border-[#FFFCF6] overflow-hidden bg-[#F2DEC3]">
                      <Image 
                        src={`/images/avatar-placeholder.webp`} 
                        alt="User" 
                        fill
                        className="object-cover scale-150"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 text-[#C98B5A]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-[#4A2F22]/80 mt-0.5">
                    Loved by <span className="text-[#3A241A] font-black">500+ happy pet parents</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Image in elegant frame */}
            <div className="w-full lg:w-[42%] h-[320px] lg:h-[480px] relative rounded-[32px] overflow-hidden bg-[#F2DEC3]/25 border border-[#EAD7C2]/50 shadow-[0_12px_30px_rgba(74,47,34,0.04)]">
              <Image 
                src={firstSlide.image} 
                alt={firstSlide.badge} 
                fill
                priority
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Interactive Carousel: Renders once mounted on the client
  return (
    <section className="relative overflow-hidden bg-[#FFFCF6] py-8 lg:py-12 px-4 sm:px-6 lg:px-8 font-sans font-medium">
      
      {/* ── Outer Hero Card: Rounded 36px with Soft Warm Shadow ── */}
      <div className="mx-auto max-w-[1320px] rounded-[36px] bg-[#FFFCF6] border border-[#EAD7C2] shadow-[0_18px_50px_rgba(74,47,34,0.06)] overflow-hidden relative min-h-[580px] lg:min-h-[640px] flex items-center">
        
        {/* Embla Viewport */}
        <div className="overflow-hidden w-full h-full" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {SLIDES.map((slide, index) => (
              <div 
                key={slide.id} 
                className="flex-[0_0_100%] min-w-0 w-full min-h-[580px] lg:min-h-[640px] flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden bg-[#FFFCF6] px-6 sm:px-12 lg:px-16 py-12 lg:py-16"
              >
                
                {/* ── Left Column: Slide Content ── */}
                <div 
                  className={cn(
                    "w-full lg:w-[55%] flex flex-col justify-center text-left z-10 transition-all duration-700 ease-out",
                    selectedIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                  )}
                >
                  {/* Small Sticker Badge */}
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#4A2F22]/20 bg-[#4A2F22]/5 text-[#4A2F22] text-xs font-black uppercase tracking-wider w-max mb-6 shadow-sm">
                    <Sparkles size={14} className="text-[#C98B5A]" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Editorial Headline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-[#3A241A] leading-[1.1]">
                    {slide.headline}
                  </h1>
                  
                  {/* Subheading */}
                  <p className="text-[#4A2F22]/90 text-base sm:text-lg font-medium leading-relaxed mt-6">
                    {slide.subheading}
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link 
                      href="/category/all" 
                      className="inline-flex items-center justify-center rounded-full bg-[#4A2F22] px-8 py-4 text-base font-black text-[#FFF8EC] shadow-[0_10px_20px_rgba(74,47,34,0.12)] hover:bg-[#3A241A] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {slide.primaryCta}
                    </Link>
                    <Link 
                      href="/#categories" 
                      className="inline-flex items-center justify-center rounded-full bg-white/60 border border-[#4A2F22]/30 px-8 py-4 text-base font-black text-[#4A2F22] shadow-sm hover:bg-[#4A2F22]/10 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {slide.secondaryCta}
                    </Link>
                  </div>

                  {/* Trust Microcopy - Slide 1 only */}
                  {index === 0 && (
                    <div className="mt-10 flex items-center gap-5 pt-6 border-t border-[#4A2F22]/10">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((num) => (
                          <div key={num} className="relative w-8 h-8 rounded-full border-2 border-[#FFFCF6] overflow-hidden bg-[#F2DEC3]">
                            <Image 
                              src={`/images/avatar-placeholder.webp`} 
                              alt="User" 
                              fill
                              className="object-cover scale-150"
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex gap-0.5 text-[#C98B5A]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="fill-current" />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-[#4A2F22]/80 mt-0.5">
                          Loved by <span className="text-[#3A241A] font-black">500+ happy pet parents</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Right Column: Premium Image Card ── */}
                <div 
                  className={cn(
                    "w-full lg:w-[42%] h-[320px] lg:h-[480px] relative rounded-[32px] overflow-hidden bg-[#F2DEC3]/25 border border-[#EAD7C2]/50 shadow-[0_12px_30px_rgba(74,47,34,0.04)] transition-all duration-700 ease-out",
                    selectedIndex === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                  )}
                >
                  <Image 
                    src={slide.image} 
                    alt={slide.badge} 
                    fill
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls: Rounded Soft Buttons */}
        <div className="hidden sm:flex absolute right-8 bottom-8 gap-2.5 z-20">
          <button
            className="w-11 h-11 rounded-full bg-[#FFFCF6]/80 border border-[#EAD7C2] flex items-center justify-center text-[#4A2F22] shadow-sm hover:bg-[#F7EAD8]/80 hover:text-[#3A241A] active:scale-95 transition-all backdrop-blur-sm"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="w-11 h-11 rounded-full bg-[#FFFCF6]/80 border border-[#EAD7C2] flex items-center justify-center text-[#4A2F22] shadow-sm hover:bg-[#F7EAD8]/80 hover:text-[#3A241A] active:scale-95 transition-all backdrop-blur-sm"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-16 lg:translate-x-0 flex gap-2 z-20">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                selectedIndex === i ? "w-8 bg-[#4A2F22]" : "w-2.5 bg-[#4A2F22]/25 hover:bg-[#4A2F22]/50"
              )}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
