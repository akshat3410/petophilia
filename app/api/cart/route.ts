import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAuth } from "@/lib/api";
import { addToCartSchema } from "@/lib/validations";

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
          brand: { select: { name: true } },
        },
      },
      variant: true,
    },
  },
};

export async function GET() {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const cart = await db.cart.findUnique({
      where: { userId: session!.user.id },
      include: cartInclude,
    });
    return ok(cart ?? { items: [] });
  } catch (e) {
    console.error("[GET /api/cart]", e);
    return err("Failed to fetch cart", 500);
  }
}

export async function POST(req: NextRequest) {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = addToCartSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const { productId, variantId, quantity } = parsed.data;

    // Validate product exists and is active
    const product = await db.product.findUnique({
      where: { id: productId, isActive: true },
      include: { variants: true },
    });
    if (!product) return err("Product not found or unavailable", 404);

    // Stock check
    const availableStock = variantId
      ? (product.variants.find((v) => v.id === variantId)?.stock ?? 0)
      : product.stock;
    if (availableStock < quantity) return err("Insufficient stock", 422, "OUT_OF_STOCK");

    // Upsert cart
    const cart = await db.cart.upsert({
      where: { userId: session!.user.id },
      update: {},
      create: { userId: session!.user.id },
    });

    // Check existing item
    const existing = await db.cartItem.findUnique({
      where: { cartId_productId_variantId: { cartId: cart.id, productId, variantId: variantId ?? "" } },
    });

    // Note: Prisma unique constraint has null issue — handle manually
    const existingAlt = await db.cartItem.findFirst({
      where: { cartId: cart.id, productId, variantId: variantId ?? null },
    });

    if (existingAlt) {
      const newQty = existingAlt.quantity + quantity;
      if (newQty > availableStock) return err("Insufficient stock", 422, "OUT_OF_STOCK");
      await db.cartItem.update({ where: { id: existingAlt.id }, data: { quantity: newQty } });
    } else {
      await db.cartItem.create({
        data: { cartId: cart.id, productId, variantId: variantId ?? null, quantity },
      });
    }

    const updatedCart = await db.cart.findUnique({ where: { id: cart.id }, include: cartInclude });
    return ok(updatedCart, 201);
  } catch (e) {
    console.error("[POST /api/cart]", e);
    return err("Failed to add to cart", 500);
  }
}

export async function DELETE() {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const cart = await db.cart.findUnique({ where: { userId: session!.user.id } });
    if (cart) await db.cartItem.deleteMany({ where: { cartId: cart.id } });
    return ok({ message: "Cart cleared" });
  } catch (e) {
    console.error("[DELETE /api/cart]", e);
    return err("Failed to clear cart", 500);
  }
}
