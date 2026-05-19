import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAdmin } from "@/lib/api";
import { couponSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const coupon = await db.coupon.update({ where: { id: params.id }, data: parsed.data });
    return ok(coupon);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2025") return err("Coupon not found", 404);
    if ((e as { code?: string }).code === "P2002") return err("Code already exists", 409);
    return err("Failed to update coupon", 500);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await db.coupon.update({ where: { id: params.id }, data: { isActive: false } });
    return ok({ message: "Coupon deactivated" });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2025") return err("Coupon not found", 404);
    return err("Failed to delete coupon", 500);
  }
}
