import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAdmin } from "@/lib/api";
import { couponSchema } from "@/lib/validations";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return ok(coupons);
  } catch (e) {
    console.error(e);
    return err("Failed to fetch coupons", 500);
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const coupon = await db.coupon.create({ data: parsed.data });
    return ok(coupon, 201);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return err("Coupon code already exists", 409);
    return err("Failed to create coupon", 500);
  }
}
