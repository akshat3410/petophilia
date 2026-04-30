import { Truck, CheckCircle2, Heart } from "lucide-react";

export function TrustSignals() {
  return (
    <section className="bg-sand/30 py-12 border-t border-gray-100">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-gray-200">
          
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-teal/10 text-teal flex items-center justify-center mb-4">
              <Truck size={24} />
            </div>
            <h3 className="text-[16px] font-bold text-ink mb-1">Free Shipping</h3>
            <p className="text-[14px] text-ink-muted font-medium">Over ₹999</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-teal/10 text-teal flex items-center justify-center mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-[16px] font-bold text-ink mb-1">Quality Assured</h3>
            <p className="text-[14px] text-ink-muted font-medium">Premium Brands</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-[#E53935]/10 text-[#E53935] flex items-center justify-center mb-4">
              <Heart size={24} />
            </div>
            <h3 className="text-[16px] font-bold text-ink mb-1">Pet Parent Loved</h3>
            <p className="text-[14px] text-ink-muted font-medium">4.8★ (2,450 reviews)</p>
          </div>

        </div>
      </div>
    </section>
  );
}
