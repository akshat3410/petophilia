"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Brand { id: string; name: string; slug: string; tagline: string | null; isActive: boolean; _count: { products: number } }

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Brand> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/brands");
    const data = await res.json();
    if (data.success) setBrands(data.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    const url = isNew ? "/api/admin/brands" : `/api/admin/brands/${editing.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...editing, isActive: editing.isActive ?? true }) });
    const data = await res.json();
    setSaving(false);
    if (data.success) { toast.success(isNew ? "Brand created" : "Brand updated"); setEditing(null); load(); }
    else toast.error(data.error);
  }

  async function del(id: string, name: string) {
    if (!confirm(`Deactivate "${name}"?`)) return;
    const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deactivated"); load(); }
  }

  const inputCls = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
        <button onClick={() => setEditing({ name: "", slug: "", tagline: "", isActive: true })} className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-[#128a96]">
          <Plus size={16} /> Add Brand
        </button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 space-y-4">
          <h2 className="font-bold text-gray-900">{editing.id ? "Edit Brand" : "New Brand"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Name *</label>
              <input value={editing.name ?? ""} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value, slug: p?.id ? p.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Slug *</label>
              <input value={editing.slug ?? ""} onChange={(e) => setEditing((p) => ({ ...p, slug: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Tagline</label>
            <input value={editing.tagline ?? ""} onChange={(e) => setEditing((p) => ({ ...p, tagline: e.target.value }))} className={inputCls} placeholder="Grass-fed, slow cooked" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="rounded-lg bg-accent px-5 py-2 text-sm font-bold text-white hover:bg-[#128a96] disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
            <button onClick={() => setEditing(null)} className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? <div className="h-32 animate-pulse" /> : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Tagline</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Products</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{b.name}</td>
                  <td className="px-4 py-4 text-gray-500 text-xs">{b.tagline ?? "—"}</td>
                  <td className="px-4 py-4 text-gray-600">{b._count.products}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing(b)} className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold hover:border-accent hover:text-accent"><Edit2 size={12} /> Edit</button>
                      <button onClick={() => del(b.id, b.name)} className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold hover:border-red-300 hover:text-red-600"><Trash2 size={12} /> Delete</button>
                    </div>
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
