import { db } from "@/lib/db";
import { ok, err } from "@/lib/api";

export async function GET() {
  try {
    const brands = await db.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    });
    return ok(brands);
  } catch (e) {
    console.error("[GET /api/brands]", e);
    return err("Failed to fetch brands", 500);
  }
}
