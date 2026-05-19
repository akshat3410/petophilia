"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, ShoppingBag, Users, Package, Clock, AlertTriangle } from "lucide-react";

interface DashboardData {
  stats: {
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    totalRevenue: number;
    monthRevenue: number;
  };
  lowStockProducts: Array<{ id: string; name: string; stock: number }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    user: { name: string | null; email: string };
  }>;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  PACKED: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

function fmt(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-red-500">Failed to load dashboard.</p>;

  const { stats, lowStockProducts, recentOrders } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Pet-o-philia Admin Overview</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={fmt(stats.totalRevenue)} icon={TrendingUp} color="bg-green-100 text-green-600" />
        <StatCard label="This Month" value={fmt(stats.monthRevenue)} icon={TrendingUp} color="bg-accent/10 text-accent" />
        <StatCard label="Total Orders" value={stats.totalOrders.toLocaleString()} icon={ShoppingBag} color="bg-blue-100 text-blue-600" />
        <StatCard label="Customers" value={stats.totalCustomers.toLocaleString()} icon={Users} color="bg-purple-100 text-purple-600" />
        <StatCard label="Active Products" value={stats.totalProducts.toLocaleString()} icon={Package} color="bg-offer-100 text-offer-600" />
        <StatCard label="Pending Orders" value={stats.pendingOrders.toLocaleString()} icon={Clock} color="bg-yellow-100 text-yellow-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-accent hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-bold text-gray-900">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.user.name ?? order.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{fmt(order.total)}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
            {recentOrders.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-gray-400">No orders yet</p>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={14} className="text-offer-500" /> Low Stock Alerts
            </h2>
            <Link href="/admin/products" className="text-xs font-semibold text-accent hover:underline">Manage</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {lowStockProducts.map((p) => (
              <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{p.name}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock === 0 ? "bg-red-100 text-red-600" : "bg-offer-100 text-offer-600"}`}>
                  {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                </span>
              </Link>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-gray-400">All products well stocked ✓</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
