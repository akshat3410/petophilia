import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAuth } from "@/lib/api";
import { validateCouponSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const { response } = await requireAuth();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = validateCouponSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const { code, orderAmount } = parsed.data;
    const coupon = await db.coupon.findUnique({ where: { code, isActive: true } });
    if (!coupon) return err("Invalid coupon code", 404);
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return err("Coupon has expired");
    if (coupon.startsAt && coupon.startsAt > new Date()) return err("Coupon not yet active");
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return err("Coupon usage limit reached");
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return err(`Minimum order ₹${coupon.minOrderAmount / 100} required`);
    }

    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = Math.round((orderAmount * coupon.value) / 100);
      if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
    } else {
      discount = Math.min(coupon.value, orderAmount);
    }

    return ok({ code: coupon.code, type: coupon.type, value: coupon.value, discount });
  } catch (e) {
    console.error("[POST /api/coupons/validate]", e);
    return err("Failed to validate coupon", 500);
  }
}
