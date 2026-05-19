"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  PACKED: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const STATUSES = ["PENDING", "PAID", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
const fmt = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;
const fmtDate = (d: string) => new Date(d).toLocaleString("en-IN");

interface OrderItem { id: string; productName: string; price: number; quantity: number; total: number }
interface Order {
  id: string; orderNumber: string; status: string; paymentStatus: string;
  subtotal: number; discount: number; shippingFee: number; total: number;
  createdAt: string; notes: string | null;
  user: { name: string | null; email: string; phone: string | null };
  address: { fullName: string; phone: string; addressLine1: string; addressLine2?: string; city: string; state: string; postalCode: string };
  items: OrderItem[];
  coupon: { code: string } | null;
  payment: { providerPaymentId: string | null } | null;
}

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) { setOrder(d.data); setNewStatus(d.data.status); }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  async function updateStatus() {
    if (!order || newStatus === order.status) return;
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    setUpdating(false);
    if (data.success) {
      setOrder((prev) => prev ? { ...prev, status: newStatus } : prev);
      toast.success("Order status updated");
    } else {
      toast.error("Failed to update status");
    }
  }

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />;
  if (!order) return <p className="text-red-500">Order not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ChevronLeft size={16} /> Orders
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">#{order.orderNumber}</h1>
        <span className={`ml-2 rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLOR[order.status] ?? "bg-gray-100"}`}>
          {order.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {/* Items */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Items Ordered</h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500">{fmt(item.price)} × {item.quantity}</p>
                  </div>
                  <p className="font-mono font-bold text-gray-900">{fmt(item.total)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount {order.coupon ? `(${order.coupon.code})` : ""}</span><span>−{fmt(order.discount)}</span></div>}
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingFee === 0 ? "Free" : fmt(order.shippingFee)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2 mt-2"><span>Total</span><span>{fmt(order.total)}</span></div>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Customer</h2>
            <p className="font-semibold text-gray-900">{order.user.name}</p>
            <p className="text-sm text-gray-500">{order.user.email}</p>
            {order.user.phone && <p className="text-sm text-gray-500">{order.user.phone}</p>}
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Shipping Address</h2>
            <p className="font-semibold text-gray-900">{order.address.fullName}</p>
            <p className="text-sm text-gray-600">{order.address.addressLine1}{order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}</p>
            <p className="text-sm text-gray-600">{order.address.city}, {order.address.state} — {order.address.postalCode}</p>
            <p className="text-sm text-gray-600">{order.address.phone}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Update Status */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-900">Update Status</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={updateStatus}
              disabled={updating || newStatus === order.status}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-bold text-white hover:bg-[#128a96] disabled:opacity-50 transition-colors"
            >
              {updating ? "Updating…" : "Update Status"}
            </button>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Payment</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`font-bold ${order.paymentStatus === "PAID" ? "text-green-600" : "text-yellow-600"}`}>{order.paymentStatus}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-mono font-bold">{fmt(order.total)}</span></div>
              {order.payment?.providerPaymentId && (
                <div className="flex justify-between"><span className="text-gray-500">Razorpay ID</span><span className="font-mono text-xs text-gray-600 truncate max-w-[130px]">{order.payment.providerPaymentId}</span></div>
              )}
            </div>
          </div>

          {/* Order info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Order Info</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Placed</span><span className="text-gray-700">{fmtDate(order.createdAt)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
