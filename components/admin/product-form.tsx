"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X, Plus } from "lucide-react";

interface Category { id: string; name: string; slug: string }
interface Brand { id: string; name: string; slug: string }
interface ProductImage { url: string; alt?: string }

interface ProductFormProps {
  productId?: string;
  initialData?: Record<string, unknown>;
}

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!productId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<ProductImage[]>((initialData?.images as ProductImage[]) ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: (initialData?.name as string) ?? "",
    slug: (initialData?.slug as string) ?? "",
    description: (initialData?.description as string) ?? "",
    shortDescription: (initialData?.shortDescription as string) ?? "",
    unit: (initialData?.unit as string) ?? "",
    price: initialData?.price ? String(Number(initialData.price) / 100) : "",
    compareAtPrice: initialData?.compareAtPrice ? String(Number(initialData.compareAtPrice) / 100) : "",
    sku: (initialData?.sku as string) ?? "",
    stock: String(initialData?.stock ?? "0"),
    lowStockThreshold: String(initialData?.lowStockThreshold ?? "5"),
    categoryId: (initialData?.categoryId as string) ?? "",
    brandId: (initialData?.brandId as string) ?? "",
    isActive: (initialData?.isActive as boolean) ?? true,
    isFeatured: (initialData?.isFeatured as boolean) ?? false,
    isBestSeller: (initialData?.isBestSeller as boolean) ?? false,
    isNewArrival: (initialData?.isNewArrival as boolean) ?? false,
    tags: Array.isArray(initialData?.tags) ? (initialData.tags as string[]).join(", ") : "",
    tint: (initialData?.tint as string) ?? "#E8DCD5",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/brands").then((r) => r.json()),
    ]).then(([cats, brnds]) => {
      if (cats.success) setCategories(cats.data);
      if (brnds.success) setBrands(brnds.data);
    });
  }, []);

  function setField(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function autoSlug(name: string) {
    setForm((prev) => ({ ...prev, name, slug: generateSlug(name) }));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      // Get signed params from backend
      const sigRes = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ folder: "petophilia/products" }) });
      const { data: sig } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", sig.signature);
      formData.append("timestamp", String(sig.timestamp));
      formData.append("api_key", sig.apiKey);
      formData.append("folder", sig.folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData.secure_url) {
        setImages((prev) => [...prev, { url: uploadData.secure_url, alt: file.name.replace(/\.[^.]+$/, "") }]);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      shortDescription: form.shortDescription,
      unit: form.unit,
      price: Math.round(parseFloat(form.price) * 100),
      compareAtPrice: form.compareAtPrice ? Math.round(parseFloat(form.compareAtPrice) * 100) : undefined,
      sku: form.sku,
      stock: parseInt(form.stock),
      lowStockThreshold: parseInt(form.lowStockThreshold),
      categoryId: form.categoryId,
      brandId: form.brandId,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isBestSeller: form.isBestSeller,
      isNewArrival: form.isNewArrival,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      tint: form.tint,
      images,
    };

    const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();

    setSaving(false);
    if (data.success) {
      toast.success(isEdit ? "Product updated" : "Product created");
      router.push("/admin/products");
    } else {
      toast.error(data.error ?? "Failed to save product");
    }
  }

  const inputCls = "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div className="space-y-6">
          {/* Basic info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Basic Information</h2>
            <div>
              <label className={labelCls}>Product Name *</label>
              <input required value={form.name} onChange={(e) => autoSlug(e.target.value)} className={inputCls} placeholder="Slow-Cooked Chicken & Oat" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Slug *</label>
                <input required value={form.slug} onChange={(e) => setField("slug", e.target.value)} className={inputCls} placeholder="slow-cooked-chicken-oat" />
              </div>
              <div>
                <label className={labelCls}>SKU *</label>
                <input required value={form.sku} onChange={(e) => setField("sku", e.target.value)} className={inputCls} placeholder="MK-001" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Short Description</label>
              <input value={form.shortDescription} onChange={(e) => setField("shortDescription", e.target.value)} className={inputCls} maxLength={200} placeholder="One-line summary for cards" />
            </div>
            <div>
              <label className={labelCls}>Full Description</label>
              <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} className={`${inputCls} min-h-[120px] resize-y`} placeholder="Detailed product description…" />
            </div>
            <div>
              <label className={labelCls}>Unit / Size</label>
              <input value={form.unit} onChange={(e) => setField("unit", e.target.value)} className={inputCls} placeholder="2.5kg pouch" />
            </div>
            <div>
              <label className={labelCls}>Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => setField("tags", e.target.value)} className={inputCls} placeholder="Grain-free, Adult, Sensitive tummy" />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price (₹) *</label>
                <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} className={inputCls} placeholder="1480" />
              </div>
              <div>
                <label className={labelCls}>Compare-at Price (₹)</label>
                <input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={(e) => setField("compareAtPrice", e.target.value)} className={inputCls} placeholder="1650" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Stock *</label>
                <input required type="number" min="0" value={form.stock} onChange={(e) => setField("stock", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Low Stock Threshold</label>
                <input type="number" min="0" value={form.lowStockThreshold} onChange={(e) => setField("lowStockThreshold", e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Product Images</h2>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 text-red-500 hover:bg-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-accent hover:text-accent transition-colors">
                {uploading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" /> : <Upload size={20} />}
                <span className="text-xs font-semibold">{uploading ? "Uploading…" : "Add image"}</span>
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Category & Brand */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Organization</h2>
            <div>
              <label className={labelCls}>Category *</label>
              <select required value={form.categoryId} onChange={(e) => setField("categoryId", e.target.value)} className={inputCls}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Brand *</label>
              <select required value={form.brandId} onChange={(e) => setField("brandId", e.target.value)} className={inputCls}>
                <option value="">Select brand</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Card Tint Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.tint} onChange={(e) => setField("tint", e.target.value)} className="h-10 w-16 rounded cursor-pointer border border-gray-200" />
                <input value={form.tint} onChange={(e) => setField("tint", e.target.value)} className={`${inputCls} flex-1`} placeholder="#E8DCD5" />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-900">Status & Flags</h2>
            {[
              { key: "isActive", label: "Active (visible in store)" },
              { key: "isFeatured", label: "Featured on homepage" },
              { key: "isBestSeller", label: "Best Seller" },
              { key: "isNewArrival", label: "New Arrival" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-semibold text-gray-700">{label}</span>
                <div
                  onClick={() => setField(key, !form[key as keyof typeof form])}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form[key as keyof typeof form] ? "bg-accent" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form[key as keyof typeof form] ? "translate-x-5" : ""}`} />
                </div>
              </label>
            ))}
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full rounded-lg bg-accent py-3 text-sm font-bold text-white hover:bg-[#128a96] transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
