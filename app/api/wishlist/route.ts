import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAuth } from "@/lib/api";
import { z } from "zod";

export async function GET() {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const items = await db.wishlist.findMany({
      where: { userId: session!.user.id },
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
            brand: { select: { name: true } },
            category: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return ok(items);
  } catch (e) {
    console.error("[GET /api/wishlist]", e);
    return err("Failed to fetch wishlist", 500);
  }
}

const addSchema = z.object({ productId: z.string().cuid() });

export async function POST(req: NextRequest) {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = addSchema.safeParse(body);
    if (!parsed.success) return err("Invalid product ID");

    const { productId } = parsed.data;

    const product = await db.product.findUnique({ where: { id: productId, isActive: true } });
    if (!product) return err("Product not found", 404);

    const item = await db.wishlist.upsert({
      where: { userId_productId: { userId: session!.user.id, productId } },
      update: {},
      create: { userId: session!.user.id, productId },
    });
    return ok(item, 201);
  } catch (e) {
    console.error("[POST /api/wishlist]", e);
    return err("Failed to add to wishlist", 500);
  }
}
