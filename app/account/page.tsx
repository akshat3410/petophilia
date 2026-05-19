"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface DashboardData {
  user: { name: string | null; email: string; createdAt: string } | null;
  stats: {
    totalOrders: number;
    activeSubscriptions: number;
    totalSavings: number;
    wishlistCount: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    items: Array<{ productName: string; productImage: string | null }>;
  }>;
  subscriptions: Array<{
    id: string;
    frequency: string;
    nextDeliveryDate: string | null;
    product: { name: string; images: Array<{ url: string }> };
  }>;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Processing",
  PAID: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export default function AccountPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/dashboard")
      .then((r) => r.json())
      .then((d) => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const firstName = (data?.user?.name ?? session?.user?.name ?? "there").split(" ")[0];
  const memberSince = data?.user?.createdAt
    ? new Date(data.user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })
    : "…";

  if (loading) {
    return (
      <section className="mx-auto max-w-[1200px] px-8 py-14">
        <div className="h-20 animate-pulse rounded-xl bg-gray-200 w-72 mb-10" />
        <div className="grid gap-4 md:grid-cols-4 mb-10">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-lg bg-gray-200" />)}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1200px] px-8 py-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mono-label">/your pantry · member since {memberSince}</p>
          <h1 className="mt-3 font-serif text-[72px] italic leading-[0.95] text-primary">
            Hello, {firstName}.
          </h1>
        </div>
        <div className="rounded-full bg-sage/60 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
          pantry-keeper · tier {String(Math.min(5, Math.floor((data?.stats.totalOrders ?? 0) / 3) + 1)).padStart(2, "0")}
        </div>
      </div>

      {/* Stat tiles */}
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {[
          { label: "Active subs", value: String(data?.stats.activeSubscriptions ?? 0), tint: "bg-clay" },
          { label: "Orders YTD", value: String(data?.stats.totalOrders ?? 0), tint: "bg-sage" },
          { label: "Saved", value: formatPrice(data?.stats.totalSavings ?? 0), tint: "bg-bg-tint" },
          { label: "Wishlist", value: String(data?.stats.wishlistCount ?? 0), tint: "bg-clay" },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg ${s.tint} p-6`}>
            <p className="mono-label">/{s.label.toLowerCase()}</p>
            <p className="mt-3 font-serif text-[42px] italic leading-none text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Orders */}
        <div>
          <div className="flex items-end justify-between">
            <p className="mono-label">/recent orders</p>
            <Link href="/account/orders" className="text-[13px] text-muted underline underline-offset-4 hover:text-offer">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {data?.recentOrders.length === 0 && (
              <li className="rounded-lg border border-border bg-white p-6 text-center text-sm text-muted">
                No orders yet.{" "}
                <Link href="/" className="underline hover:text-accent">Start shopping →</Link>
              </li>
            )}
            {data?.recentOrders.map((o) => (
              <li key={o.id} className="flex items-center gap-5 rounded-lg border border-border bg-white p-5">
                <div className="flex gap-1.5">
                  {o.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="relative h-14 w-14 overflow-hidden rounded-[8px] bg-gray-100 flex items-center justify-center">
                      {item.productImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400">📦</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                    #{o.orderNumber} · {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                  <p className="mt-1 font-serif text-[18px] italic text-primary">
                    {STATUS_LABEL[o.status] ?? o.status}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-[14px] text-primary">{formatPrice(o.total)}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Active subs */}
        <aside>
          <p className="mono-label">/active subscriptions</p>
          <div className="mt-4 space-y-4">
            {data?.subscriptions.length === 0 && (
              <div className="rounded-lg bg-clay/30 p-5 text-sm text-muted text-center">
                No active subscriptions.
              </div>
            )}
            {data?.subscriptions.map((sub) => (
              <div key={sub.id} className="rounded-lg bg-clay/50 p-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] bg-gray-100">
                    {sub.product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sub.product.images[0].url} alt={sub.product.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mono-label">every {sub.frequency.toLowerCase()}</p>
                    <p className="mt-1 truncate text-[14px] font-medium text-primary">{sub.product.name}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-muted">
                  <span>
                    Next ·{" "}
                    {sub.nextDeliveryDate
                      ? new Date(sub.nextDeliveryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                      : "TBD"}
                  </span>
                  <button className="text-primary underline underline-offset-4 hover:text-offer">
                    Skip · Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
