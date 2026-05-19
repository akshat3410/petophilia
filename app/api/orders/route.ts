import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAuth, generateOrderNumber } from "@/lib/api";
import { createOrderSchema } from "@/lib/validations";

const orderInclude = {
  items: true,
  address: true,
  coupon: { select: { code: true, type: true, value: true } },
  payment: true,
};

export async function GET(req: NextRequest) {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1));
    const limit = 10;

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where: { userId: session!.user.id },
        include: {
          items: true,
          address: { select: { city: true, state: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where: { userId: session!.user.id } }),
    ]);

    return ok({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error("[GET /api/orders]", e);
    return err("Failed to fetch orders", 500);
  }
}

export async function POST(req: NextRequest) {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const { addressId, couponCode } = parsed.data;
    const userId = session!.user.id;

    // Verify address belongs to user
    const address = await db.address.findFirst({ where: { id: addressId, userId } });
    if (!address) return err("Address not found", 404);

    // Get cart
    const cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) return err("Cart is empty", 422);

    // Validate all items and calculate subtotal
    let subtotal = 0;
    for (const item of cart.items) {
      if (!item.product.isActive) return err(`"${item.product.name}" is no longer available`, 422);
      const stock = item.variant ? item.variant.stock : item.product.stock;
      if (stock < item.quantity) return err(`"${item.product.name}" has insufficient stock`, 422, "OUT_OF_STOCK");
      const price = item.product.price + (item.variant?.priceAdjustment ?? 0);
      subtotal += price * item.quantity;
    }

    // Validate coupon
    let discount = 0;
    let couponId: string | undefined;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({ where: { code: couponCode.toUpperCase(), isActive: true } });
      if (!coupon) return err("Invalid or expired coupon", 422);
      if (coupon.expiresAt && coupon.expiresAt < new Date()) return err("Coupon has expired", 422);
      if (coupon.startsAt && coupon.startsAt > new Date()) return err("Coupon not yet active", 422);
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return err("Coupon usage limit reached", 422);
      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        return err(`Minimum order ₹${coupon.minOrderAmount / 100} required for this coupon`, 422);
      }
      if (coupon.type === "PERCENTAGE") {
        discount = Math.round((subtotal * coupon.value) / 100);
        if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
      } else {
        discount = Math.min(coupon.value, subtotal);
      }
      couponId = coupon.id;
    }

    const shippingFee = subtotal >= 200000 ? 0 : 4900; // Free shipping above ₹2000
    const total = subtotal - discount + shippingFee;

    // Create order + snapshot items in transaction
    const order = await db.$transaction(async (tx: any) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber: generateOrderNumber(),
          addressId,
          couponId,
          subtotal,
          discount,
          shippingFee,
          total,
          status: "PENDING",
          paymentStatus: "PENDING",
          items: {
            create: cart.items.map((item) => {
              const price = item.product.price + (item.variant?.priceAdjustment ?? 0);
              return {
                productId: item.product.id,
                variantId: item.variantId,
                productName: item.product.name + (item.variant ? ` (${item.variant.value})` : ""),
                productImage: null,
                price,
                quantity: item.quantity,
                total: price * item.quantity,
              };
            }),
          },
        },
      });

      // Increment coupon usage
      if (couponId) await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });

      return newOrder;
    });

    return ok({ orderId: order.id, total: order.total }, 201);
  } catch (e) {
    console.error("[POST /api/orders]", e);
    return err("Failed to create order", 500);
  }
}
