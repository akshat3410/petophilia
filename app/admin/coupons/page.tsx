"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface Coupon {
  id: string; code: string; type: string; value: number;
  minOrderAmount: number | null; usageLimit: number | null; usedCount: number;
  expiresAt: string | null; isActive: boolean;
}

const fmt = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ code: "", type: "PERCENTAGE", value: "", minOrderAmount: "", usageLimit: "", expiresAt: "", isActive: true });

  async function load() {
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    if (data.success) setCoupons(data.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      code: form.code,
      type: form.type,
      value: form.type === "PERCENTAGE" ? parseInt(form.value) : Math.round(parseFloat(form.value) * 100),
      minOrderAmount: form.minOrderAmount ? Math.round(parseFloat(form.minOrderAmount) * 100) : undefined,
      usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      isActive: form.isActive,
    };
    const res = await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setSaving(false);
    if (data.success) { toast.success("Coupon created"); setShowForm(false); setForm({ code: "", type: "PERCENTAGE", value: "", minOrderAmount: "", usageLimit: "", expiresAt: "", isActive: true }); load(); }
    else toast.error(data.error);
  }

  async function del(id: string, code: string) {
    if (!confirm(`Deactivate coupon "${code}"?`)) return;
    const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deactivated"); load(); }
  }

  const inputCls = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-[#128a96]">
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <form onSubmit={save} className="space-y-4">
            <h2 className="font-bold text-gray-900">New Coupon</h2>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Code *</label><input required value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} className={inputCls} placeholder="WELCOME10" /></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Type *</label>
                <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className={inputCls}>
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed (₹)</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Value *</label><input required type="number" min="0" value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} className={inputCls} placeholder={form.type === "PERCENTAGE" ? "10 (= 10%)" : "200 (= ₹200)"} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Min Order (₹)</label><input type="number" min="0" value={form.minOrderAmount} onChange={(e) => setForm((p) => ({ ...p, minOrderAmount: e.target.value }))} className={inputCls} placeholder="500" /></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Usage Limit</label><input type="number" min="0" value={form.usageLimit} onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))} className={inputCls} placeholder="100" /></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Expires At</label><input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))} className={inputCls} /></div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="rounded-lg bg-accent px-5 py-2 text-sm font-bold text-white hover:bg-[#128a96] disabled:opacity-60">{saving ? "Saving…" : "Create Coupon"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? <div className="h-32 animate-pulse" /> : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Code</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Discount</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Min Order</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Usage</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Expires</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{c.code}</td>
                  <td className="px-4 py-4 font-semibold">{c.type === "PERCENTAGE" ? `${c.value}%` : fmt(c.value)}</td>
                  <td className="px-4 py-4 text-gray-600">{c.minOrderAmount ? fmt(c.minOrderAmount) : "—"}</td>
                  <td className="px-4 py-4 text-gray-600">{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</td>
                  <td className="px-4 py-4 text-gray-600 text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never"}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.isActive ? "Active" : "Inactive"}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => del(c.id, c.code)} className="flex items-center gap-1 ml-auto rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold hover:border-red-300 hover:text-red-600"><Trash2 size={12} /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
