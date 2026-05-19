import { db } from "@/lib/db";
import { ok, err } from "@/lib/api";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await db.product.findUnique({
      where: { slug: params.slug, isActive: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        reviews: {
          where: { isVisible: true },
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!product) return err("Product not found", 404);

    // Related products in same category
    const related = await db.product.findMany({
      where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 }, brand: { select: { name: true } } },
      take: 4,
      orderBy: { ratingCount: "desc" },
    });

    return ok({ product, related });
  } catch (e) {
    console.error("[GET /api/products/[slug]]", e);
    return err("Failed to fetch product", 500);
  }
}
