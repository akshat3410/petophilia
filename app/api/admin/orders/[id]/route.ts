import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAdmin } from "@/lib/api";
import { updateOrderStatusSchema } from "@/lib/validations";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const order = await db.order.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        address: true,
        items: true,
        coupon: { select: { code: true, type: true, value: true } },
        payment: true,
      },
    });
    if (!order) return err("Order not found", 404);
    return ok(order);
  } catch (e) {
    console.error("[GET /api/admin/orders/[id]]", e);
    return err("Failed to fetch order", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = updateOrderStatusSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const order = await db.order.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });
    return ok(order);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2025") return err("Order not found", 404);
    console.error("[PATCH /api/admin/orders/[id]]", e);
    return err("Failed to update order status", 500);
  }
}
