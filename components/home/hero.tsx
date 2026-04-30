"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PawPrint, Gift, Heart } from 'lucide-react';

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  return (
    <section ref={ref} className="hero-section relative bg-[#1B9B95] overflow-hidden min-h-screen flex items-center font-sans">
      
      {/* 1. ANIMATED BACKGROUND VISUAL & EFFECTS */}
      <motion.div 
        className="absolute inset-0 z-0 w-full h-full"
        style={{ y: backgroundY }}
      >
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image 
            src="/images/hero-pet.png" 
            alt="Happy Husky and Cat" 
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_bottom] md:object-[80%_bottom] lg:object-[95%_center] contrast-105 saturate-[1.05]"
          />
        </motion.div>

        {/* Soft Geometric Circles & Abstract Depth */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#FF7A45]/[0.05] blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] right-[30%] w-[20vw] h-[20vw] rounded-full bg-white/[0.02] blur-[80px] pointer-events-none" />
        
        {/* Subtle glowing particles / bokeh on the right */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }} 
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute right-[15%] top-[25%] w-10 h-10 rounded-full bg-white/20 blur-xl pointer-events-none" 
        />
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }} 
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute right-[25%] bottom-[35%] w-16 h-16 rounded-full bg-[#FF7A45]/30 blur-2xl pointer-events-none" 
        />
        
        {/* Premium Matte Texture (Noise) */}
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        {/* Gradient overlays to blend text area */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#1B9B95] via-[#1B9B95]/85 to-transparent w-[65%] hidden lg:block" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#1B9B95] via-[#1B9B95]/80 to-transparent h-[70%] lg:hidden" />
      </motion.div>
      
      {/* 2. TEXT CONTENT (LEFT ALIGNED, 5 COLUMNS) */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[100px] h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
          
          <motion.div 
            className="lg:col-span-5 w-full max-w-[480px] text-left pt-[100px] lg:pt-[120px] pb-[60px]"
            style={{ y: textY, opacity }}
          >
            {/* Headlines */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="tracking-[-0.5px] leading-[1.1] drop-shadow-md"
            >
              <span className="block text-[32px] md:text-[48px] lg:text-[56px] font-medium text-[#FAFAFA]">
                Make Every Day
              </span>
              <span className="block text-[40px] md:text-[56px] lg:text-[68px] font-bold text-[#FF7A45] drop-shadow-[0_2px_10px_rgba(255,122,69,0.2)] mt-1">
                a Happy Tail Day
              </span>
            </motion.h1>
            
            {/* Body Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-[#FAFAFA] text-[16px] md:text-[18px] font-light leading-[1.6] tracking-[0.2px] max-w-[440px] mt-[24px] drop-shadow-sm"
            >
              Your curated source for everything fur baby. Premium supplies, expert care, and joy, delivered.
            </motion.p>
            
            {/* Value Proposition Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-[32px] flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#11706B]/40 text-white shadow-sm backdrop-blur-md border border-white/10">
                  <PawPrint size={18} strokeWidth={2.5} />
                </div>
                <span className="text-[16px] font-medium text-[#FAFAFA] drop-shadow-sm tracking-wide">Expert Curated</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#11706B]/40 text-white shadow-sm backdrop-blur-md border border-white/10">
                  <Gift size={18} strokeWidth={2.5} />
                </div>
                <span className="text-[16px] font-medium text-[#FAFAFA] drop-shadow-sm tracking-wide">Fast Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#11706B]/40 text-white shadow-sm backdrop-blur-md border border-white/10">
                  <Heart size={18} strokeWidth={2.5} />
                </div>
                <span className="text-[16px] font-medium text-[#FAFAFA] drop-shadow-sm tracking-wide">Trusted Care</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-[40px]"
            >
              <CTAButton />
            </motion.div>
            
          </motion.div>
          
        </div>
      </div>
      
    </section>
  );
}

// PRIMARY CTA BUTTON
function CTAButton() {
  return (
    <Link href="/category/all" passHref legacyBehavior>
      <motion.a
        className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-br from-[#0F5A57] to-[#083D3A] px-10 py-[18px] text-[18px] font-bold tracking-[0.3px] text-[#FAFAFA] shadow-[0_8px_25px_rgba(8,61,58,0.6)] overflow-hidden border border-[#FF7A45]/30 ring-1 ring-[#FF7A45]/10"
        whileHover={{ 
          scale: 1.04,
          boxShadow: '0 15px 35px rgba(8, 61, 58, 0.8), 0 0 20px rgba(255, 122, 69, 0.3)'
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Subtle interior glow */}
        <div className="absolute inset-0 rounded-full box-shadow-inner shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)]" />
        
        {/* Shimmer sweep animation */}
        <motion.div 
          className="absolute inset-0 z-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-200%', '300%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
        />
        
        <span className="relative z-10 drop-shadow-md">Shop Happy Essentials</span>
      </motion.a>
    </Link>
  );
}
