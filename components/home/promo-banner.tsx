import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="py-16 md:py-24 bg-[#FFF8EC] overflow-hidden relative">
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-12 relative">
        <div className="relative rounded-[36px] bg-[#CFE8B8]/35 border border-[#CFE8B8]/60 overflow-hidden shadow-[0_12px_40px_rgba(74,47,34,0.04)]">
          
          {/* Decorative shapes */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F8D66D]/20 rounded-full blur-[100px] z-0" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FFD9B7]/10 rounded-full blur-[120px] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 items-center relative z-10 h-full">
            
            {/* Content Side */}
            <div className="p-10 md:p-16 lg:p-20 flex flex-col justify-center order-2 md:order-1">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4A2F22] text-[#FFF8EC] text-[11px] font-black uppercase tracking-wider w-max mb-5 shadow-sm">
                <Sparkles size={12} className="text-[#F8D66D]" />
                <span>Special Collection</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-[44px] font-black text-[#3A241A] font-display leading-[1.1] mb-6">
                Premium Winter <br className="hidden lg:block" />
                Cozy Collection
              </h2>
              
              <p className="text-[#7A6253] text-base sm:text-lg font-medium max-w-md mb-8">
                Keep your furry friends warm and stylish this season. Explore our new line of cozy beds, knitwear, and wellness essentials.
              </p>
              
              <Link 
                href="/category/all" 
                className="inline-flex items-center justify-center rounded-full bg-[#4A2F22] px-8 py-4 text-sm font-black text-[#FFF8EC] shadow-[0_4px_12px_rgba(74,47,34,0.12)] hover:bg-[#6B4636] hover:-translate-y-0.5 transition-all duration-300 w-fit gap-2"
              >
                Shop Cozy Collection <ArrowRight size={16} />
              </Link>
            </div>

            {/* Image Side */}
            <div className="relative h-[350px] md:h-[500px] w-full order-1 md:order-2 flex items-center justify-center p-6 md:p-10">
              <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full overflow-hidden bg-[#FFFCF6] border-4 border-[#EAD7C2]/80 shadow-[0_16px_36px_rgba(74,47,34,0.08)] isolation-isolate">
                <Image 
                  src="/images/winter-collection.webp" 
                  alt="Cozy Winter Collection" 
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
