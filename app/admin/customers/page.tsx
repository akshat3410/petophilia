"use client";

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";

interface Customer {
  id: string; name: string | null; email: string; phone: string | null;
  createdAt: string; _count: { orders: number };
}

const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("q", search);
    const res = await fetch(`/api/admin/customers?${params}`);
    const data = await res.json();
    if (data.success) { setCustomers(data.data.customers); setTotal(data.data.total); }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">{total} customers total</p>
      </div>
      <div className="relative w-72">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name or email…" className="rounded-lg border border-gray-200 pl-9 pr-4 py-2 text-sm focus:border-accent focus:outline-none w-full" />
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? <div className="h-32 animate-pulse" /> : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{c.name ?? "—"}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </td>
                  <td className="px-4 py-4 text-gray-600 text-sm">{c.phone ?? "—"}</td>
                  <td className="px-4 py-4 font-semibold text-gray-900">{c._count.orders}</td>
                  <td className="px-4 py-4 text-gray-500 text-sm">{fmtDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
