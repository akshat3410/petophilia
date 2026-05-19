import { db } from "@/lib/db";
import { ok, err, requireAuth } from "@/lib/api";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const order = await db.order.findFirst({
      where: { id: params.id, userId: session!.user.id },
      include: {
        items: true,
        address: true,
        coupon: { select: { code: true, type: true, value: true } },
        payment: true,
      },
    });
    if (!order) return err("Order not found", 404);
    return ok(order);
  } catch (e) {
    console.error("[GET /api/orders/[id]]", e);
    return err("Failed to fetch order", 500);
  }
}
