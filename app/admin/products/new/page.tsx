import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ChevronLeft size={16} /> Products
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
