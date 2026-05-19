import { testimonials } from "@/lib/data";
import { Star, Quote, Sparkles } from "lucide-react";

export function Testimonials() {
  return (
    <section className="bg-[#FFF8EC] py-20 px-6 border-t border-[#EAD7C2]/40">
      <div className="mx-auto max-w-[1280px]">
        
        {/* Heading */}
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7C7C9]/40 border border-[#F7C7C9]/70 text-[11px] font-black uppercase tracking-wider text-[#3A241A] mb-3">
            <Sparkles size={12} className="text-[#D94F70]" />
            <span>Parent Stories</span>
          </div>
          <h2 className="text-4xl md:text-[44px] font-black text-[#3A241A] font-display leading-tight">
            Tails Are Wagging!
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#7A6253] font-medium max-w-2xl mx-auto">
            Hear from our community of loving pet parents who trust Pet-o-philia.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <figure
              key={t.who}
              className="flex flex-col justify-between rounded-[28px] bg-[#FFFCF6] border border-[#EAD7C2] p-8 shadow-[0_8px_24px_rgba(74,47,34,0.04)] hover:shadow-[0_16px_40px_rgba(74,47,34,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Quote Area */}
              <div className="mb-6">
                <Quote size={28} className="text-[#C98B5A]/20 mb-4 fill-current" />
                
                {/* Stars: Butter Yellow */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={14}
                      className="fill-[#F8D66D] text-[#F8D66D]"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                
                <blockquote className="text-[15px] font-bold leading-relaxed text-[#3A241A]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              {/* Figcaption */}
              <figcaption className="flex items-center gap-4 border-t border-[#EAD7C2]/50 pt-6 mt-auto">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#4A2F22] text-sm text-[#FFF8EC] font-black shrink-0 shadow-sm">
                  {t.who.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-[#3A241A]">{t.who}</p>
                  <p className="text-xs font-bold text-[#7A6253] mt-0.5">{t.pet}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
