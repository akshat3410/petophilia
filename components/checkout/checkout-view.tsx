"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductImage } from "@/components/product/product-image";
import { useCart } from "@/lib/cart-context";
import { formatPrice, shippingFor, FREE_SHIP_THRESHOLD } from "@/lib/utils";

type Step = "contact" | "shipping" | "payment" | "done";

export function CheckoutView() {
  const { itemsWithProduct, subtotal, clear } = useCart();
  const [step, setStep] = useState<Step>("contact");

  const shipping = shippingFor(subtotal);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const steps: Step[] = ["contact", "shipping", "payment"];
  const stepIdx = steps.indexOf(step);

  if (step === "done") return <ThankYou />;

  return (
    <section className="mx-auto max-w-[1200px] px-8 py-14">
      <div className="flex items-center gap-2 text-[12px] text-ink-muted">
        <Link href="/" className="hover:text-teal">Home</Link>
        <ChevronRight size={12} />
        <span className="text-ink">Checkout</span>
      </div>

      <div className="mt-8 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="mono-label">/checkout</p>
          <h1 className="mt-2 font-serif text-[56px] italic leading-none text-ink">
            Almost there.
          </h1>

          {/* Step pills */}
          <ol className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full ${
                    i <= stepIdx ? "bg-teal text-white" : "bg-teal/10 text-ink-muted"
                  }`}
                >
                  {i < stepIdx ? <Check size={12} /> : i + 1}
                </span>
                <span className={i === stepIdx ? "text-ink" : "text-ink-muted"}>{s}</span>
                {i < steps.length - 1 && <span className="w-8 border-t border-ink/15" />}
              </li>
            ))}
          </ol>

          <div className="mt-10 space-y-4">
            {step === "contact" && (
              <Card title="01 · Contact">
                <div className="grid gap-3">
                  <Input type="email" placeholder="Email" defaultValue="june@pet-o-philia.co" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="First name" defaultValue="June" />
                    <Input placeholder="Last name" defaultValue="Okafor" />
                  </div>
                </div>
                <Button variant="ink" size="lg" className="mt-5 w-full" onClick={() => setStep("shipping")}>
                  Continue to shipping
                </Button>
              </Card>
            )}

            {step === "shipping" && (
              <Card title="02 · Shipping">
                <div className="grid gap-3">
                  <Input placeholder="Street address" defaultValue="14 Hazelwood Lane" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="City" defaultValue="Bengaluru" />
                    <Input placeholder="PIN" defaultValue="560008" />
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  {[
                    { label: "Standard · 2–3 days", cost: shipping },
                    { label: "Express · next day", cost: 240 },
                  ].map((s, i) => (
                    <label
                      key={s.label}
                      className="flex cursor-pointer items-center justify-between rounded-[12px] border border-ink/10 bg-white p-4 hover:border-ink"
                    >
                      <span className="flex items-center gap-3">
                        <input type="radio" name="ship" defaultChecked={i === 0} />
                        <span className="text-[14px] text-ink">{s.label}</span>
                      </span>
                      <span className="font-mono text-[13px] text-ink">
                        {s.cost === 0 ? "Free" : formatPrice(s.cost)}
                      </span>
                    </label>
                  ))}
                </div>
                <Button variant="ink" size="lg" className="mt-5 w-full" onClick={() => setStep("payment")}>
                  Continue to payment
                </Button>
              </Card>
            )}

            {step === "payment" && (
              <Card title="03 · Payment">
                <Input placeholder="Card number" defaultValue="4242 4242 4242 4242" />
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Input placeholder="MM / YY" defaultValue="06 / 27" />
                  <Input placeholder="CVC" defaultValue="424" />
                </div>
                <Button
                  variant="coral"
                  size="lg"
                  className="mt-5 w-full"
                  onClick={() => {
                    clear();
                    setStep("done");
                  }}
                >
                  Place order · {formatPrice(total)}
                </Button>
                <p className="mt-3 text-center text-[11px] text-ink-muted">
                  You won't actually be charged. Promise.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl bg-sand p-8 lg:sticky lg:top-24">
          <p className="mono-label">/order summary</p>
          <h2 className="mt-2 font-serif text-[28px] italic text-ink">In your basket</h2>

          <ul className="mt-6 space-y-5">
            {itemsWithProduct.map((item) => (
              <li key={item.id} className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px]">
                  <ProductImage product={item.product} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-ink">{item.product.name}</p>
                  <p className="font-mono text-[11px] text-ink-muted">× {item.qty}</p>
                </div>
                <p className="shrink-0 font-mono text-[13px] text-ink">
                  {formatPrice(item.product.price * item.qty)}
                </p>
              </li>
            ))}
            {itemsWithProduct.length === 0 && (
              <li className="text-[13px] text-ink-muted">Your basket is empty.</li>
            )}
          </ul>

          <div className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-[13px]">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row
              label="Shipping"
              value={shipping === 0 ? "Free" : formatPrice(shipping)}
              hint={subtotal < FREE_SHIP_THRESHOLD ? `Free over ${formatPrice(FREE_SHIP_THRESHOLD)}` : undefined}
            />
            <Row label="Tax (5%)" value={formatPrice(tax)} />
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-ink/10 pt-4">
            <span className="text-[14px] text-ink-muted">Total</span>
            <span className="font-mono text-[22px] text-ink">{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-7 shadow-soft-sm">
      <p className="mono-label">/{title}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-muted">
        {label} {hint && <span className="ml-1 text-[11px]">· {hint}</span>}
      </span>
      <span className="font-mono text-ink">{value}</span>
    </div>
  );
}

function ThankYou() {
  return (
    <section className="mx-auto max-w-[780px] px-8 py-24 text-center">
      <p className="mono-label">/confirmed · #PT-04281</p>
      <h1 className="mt-6 font-serif text-[92px] italic leading-[0.95] text-ink">
        Thank you,
        <br />
        <span className="text-teal">kindly.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-[44ch] text-[16px] leading-[1.55] text-ink-soft">
        Your pantry is being packed. You'll get an email when it ships — usually within a day, with
        a note from whoever boxed it.
      </p>
      <div className="mt-10 flex justify-center gap-3">
        <Button asChild variant="coral" size="lg">
          <Link href="/account">Track order</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/">Back to the pantry</Link>
        </Button>
      </div>
    </section>
  );
}
