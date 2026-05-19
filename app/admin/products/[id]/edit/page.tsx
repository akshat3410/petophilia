"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setProduct(d.data); })
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ChevronLeft size={16} /> Products
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
      </div>
      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      ) : product ? (
        <ProductForm productId={params.id} initialData={product} />
      ) : (
        <p className="text-red-500">Product not found.</p>
      )}
    </div>
  );
}
