import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAdmin } from "@/lib/api";
import { productSchema } from "@/lib/validations";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { sortOrder: "asc" } }, variants: true, category: true, brand: true },
    });
    if (!product) return err("Product not found", 404);
    return ok(product);
  } catch (e) {
    console.error("[GET /api/admin/products/[id]]", e);
    return err("Failed to fetch product", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const { images, ...data } = parsed.data as typeof parsed.data & { images?: Array<{ url: string; alt?: string }> };

    const product = await db.product.update({
      where: { id: params.id },
      data: {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags.join(',') : (data.tags || ""),
        ...(images
          ? {
              images: {
                deleteMany: {},
                create: images.map((img, i) => ({ url: img.url, alt: img.alt, sortOrder: i })),
              },
            }
          : {}),
      },
      include: { images: true, category: true, brand: true },
    });

    return ok(product);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return err("SKU or slug already exists", 409);
    if ((e as { code?: string }).code === "P2025") return err("Product not found", 404);
    console.error("[PUT /api/admin/products/[id]]", e);
    return err("Failed to update product", 500);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    // Soft delete — set inactive rather than destroy (preserves order history)
    await db.product.update({ where: { id: params.id }, data: { isActive: false } });
    return ok({ message: "Product deactivated" });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2025") return err("Product not found", 404);
    console.error("[DELETE /api/admin/products/[id]]", e);
    return err("Failed to delete product", 500);
  }
}
