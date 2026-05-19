import { db } from "@/lib/db";
import { ok, err } from "@/lib/api";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    });
    return ok(categories);
  } catch (e) {
    console.error("[GET /api/categories]", e);
    return err("Failed to fetch categories", 500);
  }
}
