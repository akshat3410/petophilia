"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Edit2, Trash2, AlertTriangle, Eye, EyeOff } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  sku: string;
  category: { name: string };
  brand: { name: string };
  images: Array<{ url: string }>;
  createdAt: string;
}

const fmt = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("q", search);
    if (status) params.set("status", status);

    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    if (data.success) {
      setProducts(data.data.products);
      setTotal(data.data.total);
    }
    setLoading(false);
  }, [page, search, status]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function toggleActive(product: Product) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, isActive: !product.isActive, categoryId: product.category, brandId: product.brand }),
    });
    if (res.ok) {
      toast.success(product.isActive ? "Product deactivated" : "Product activated");
      fetchProducts();
    }
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Deactivate "${name}"? This will hide it from the store.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deactivated");
      fetchProducts();
    } else {
      toast.error("Failed to deactivate");
    }
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{total} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-[#128a96] transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products…"
            className="rounded-lg border border-gray-200 pl-9 pr-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 w-64"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        >
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="space-y-0 divide-y divide-gray-100">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No products found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Flags</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0].url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 max-w-[200px] truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-gray-600">{p.category.name}</span>
                    <br />
                    <span className="text-xs text-gray-400">{p.brand.name}</span>
                  </td>
                  <td className="px-4 py-4 font-mono font-semibold text-gray-900">{fmt(p.price)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {p.stock <= p.lowStockThreshold && p.stock > 0 && (
                        <AlertTriangle size={12} className="text-offer-500" />
                      )}
                      <span className={`font-semibold ${p.stock === 0 ? "text-red-600" : p.stock <= p.lowStockThreshold ? "text-offer-600" : "text-gray-900"}`}>
                        {p.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.isFeatured && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">Featured</span>}
                      {p.isBestSeller && <span className="rounded-full bg-offer-100 px-2 py-0.5 text-[10px] font-bold text-offer-600">Bestseller</span>}
                      {p.isNewArrival && <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-600">New</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-accent hover:text-accent transition-colors"
                      >
                        <Edit2 size={12} /> Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(p.id, p.name)}
                        disabled={deleting === p.id}
                        className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={12} /> {deleting === p.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <p className="text-xs text-gray-500">Showing {Math.min((page - 1) * 20 + 1, total)}–{Math.min(page * 20, total)} of {total}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold disabled:opacity-40 hover:bg-gray-50"
              >← Prev</button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 20 >= total}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold disabled:opacity-40 hover:bg-gray-50"
              >Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
