import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAdmin } from "@/lib/api";
import { productSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const search = req.nextUrl.searchParams.get("q");
    const category = req.nextUrl.searchParams.get("category");
    const status = req.nextUrl.searchParams.get("status");
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1));
    const limit = 20;

    const where: Record<string, unknown> = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (category) where.category = { slug: category };
    if (status === "active") where.isActive = true;
    if (status === "inactive") where.isActive = false;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          images: { take: 1, orderBy: { sortOrder: "asc" } },
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return ok({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error("[GET /api/admin/products]", e);
    return err("Failed to fetch products", 500);
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const { images, ...data } = parsed.data as typeof parsed.data & { images?: Array<{ url: string; alt?: string }> };

    const product = await db.product.create({
      data: {
        ...data,
        images: images?.length
          ? { create: images.map((img, i) => ({ url: img.url, alt: img.alt, sortOrder: i })) }
          : undefined,
      },
      include: { images: true, category: true, brand: true },
    });

    return ok(product, 201);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return err("SKU or slug already exists", 409);
    console.error("[POST /api/admin/products]", e);
    return err("Failed to create product", 500);
  }
}
