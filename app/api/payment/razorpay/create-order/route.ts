import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getRazorpay } from "@/lib/razorpay";
import { ok, err, requireAuth } from "@/lib/api";
import { z } from "zod";

const schema = z.object({ orderId: z.string() });

export async function POST(req: NextRequest) {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return err("Invalid request");

    const order = await db.order.findFirst({
      where: { id: parsed.data.orderId, userId: session!.user.id },
    });
    if (!order) return err("Order not found", 404);
    if (order.paymentStatus === "PAID") return err("Order already paid", 422);

    // Create Razorpay order — amount in paise
    const razorpay = getRazorpay();
    const rzpOrder = await razorpay.orders.create({
      amount: order.total,
      currency: "INR",
      receipt: order.orderNumber,
      notes: { orderId: order.id },
    });

    // Store Razorpay order ID
    await db.order.update({ where: { id: order.id }, data: { razorpayOrderId: rzpOrder.id } });

    // Create pending payment record
    await db.payment.upsert({
      where: { orderId: order.id },
      update: { providerOrderId: rzpOrder.id, status: "PENDING" },
      create: {
        orderId: order.id,
        provider: "razorpay",
        providerOrderId: rzpOrder.id,
        status: "PENDING",
        amount: order.total,
        currency: "INR",
      },
    });

    return ok({
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error("[POST /api/payment/razorpay/create-order]", e);
    return err("Failed to create payment order", 500);
  }
}
