import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const featured = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");
    const newArrival = searchParams.get("newArrival");
    const search = searchParams.get("q");
    const sort = searchParams.get("sort") ?? "createdAt_desc";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(48, Math.max(1, Number(searchParams.get("limit") ?? 12)));
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const where: Record<string, unknown> = { isActive: true };

    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };
    if (featured === "true") where.isFeatured = true;
    if (bestSeller === "true") where.isBestSeller = true;
    if (newArrival === "true") where.isNewArrival = true;
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: Number(minPrice) } : {}),
        ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
        { brand: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const orderByMap: Record<string, object> = {
      createdAt_desc: { createdAt: "desc" },
      price_asc: { price: "asc" },
      price_desc: { price: "desc" },
      rating_desc: { ratingAverage: "desc" },
      popular: { ratingCount: "desc" },
    };
    const orderBy = orderByMap[sort] ?? { createdAt: "desc" };

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
        },
      }),
      db.product.count({ where }),
    ]);

    return ok({ products, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error("[GET /api/products]", e);
    return err("Failed to fetch products", 500);
  }
}
