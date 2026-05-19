import { Truck, CheckCircle2, Heart, ShieldCheck, RefreshCcw } from "lucide-react";

const SIGNALS = [
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Free on orders ₹999+",
    iconBg: "bg-[#F8D66D]/30 text-[#4A2F22] border-[#F8D66D]/50",
  },
  {
    icon: ShieldCheck,
    title: "Vet-Approved",
    subtitle: "Safe, trusted essentials",
    iconBg: "bg-[#CFE8B8]/35 text-[#4A2F22] border-[#CFE8B8]/60",
  },
  {
    icon: CheckCircle2,
    title: "Quality Assured",
    subtitle: "Curated premium brands",
    iconBg: "bg-[#FFD9B7]/40 text-[#4A2F22] border-[#FFD9B7]/60",
  },
  {
    icon: Heart,
    title: "Parent Loved",
    subtitle: "4.9★ average rating",
    iconBg: "bg-[#F7C7C9]/35 text-[#C95C5C] border-[#F7C7C9]/60",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    subtitle: "Hassle-free policy",
    iconBg: "bg-[#D9C7F2]/30 text-[#4A2F22] border-[#D9C7F2]/50",
  },
];

export function TrustSignals() {
  return (
    <section className="bg-[#FFFCF6] py-16 border-t border-[#EAD7C2]/40">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {SIGNALS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="flex flex-col items-center text-center gap-4 group">
                <div className={`h-14 w-14 rounded-full border ${s.iconBg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-300`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-[#3A241A] font-display">{s.title}</h3>
                  <p className="text-xs text-[#7A6253] font-bold mt-1">{s.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
