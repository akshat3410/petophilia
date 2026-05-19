import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAuth } from "@/lib/api";
import { updateCartItemSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = updateCartItemSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const item = await db.cartItem.findUnique({
      where: { id: params.itemId },
      include: { cart: true, product: true, variant: true },
    });
    if (!item || item.cart.userId !== session!.user.id) {
      return err("Item not found", 404);
    }

    const stock = item.variant ? item.variant.stock : item.product.stock;
    if (parsed.data.quantity > stock) return err("Insufficient stock", 422, "OUT_OF_STOCK");

    await db.cartItem.update({
      where: { id: params.itemId },
      data: { quantity: parsed.data.quantity },
    });
    return ok({ message: "Updated" });
  } catch (e) {
    console.error("[PATCH /api/cart/[itemId]]", e);
    return err("Failed to update cart item", 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const item = await db.cartItem.findUnique({
      where: { id: params.itemId },
      include: { cart: true },
    });
    if (!item || item.cart.userId !== session!.user.id) {
      return err("Item not found", 404);
    }
    await db.cartItem.delete({ where: { id: params.itemId } });
    return ok({ message: "Removed" });
  } catch (e) {
    console.error("[DELETE /api/cart/[itemId]]", e);
    return err("Failed to remove cart item", 500);
  }
}
