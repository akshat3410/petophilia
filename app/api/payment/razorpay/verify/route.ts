import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { ok, err, requireAuth } from "@/lib/api";
import { verifyPaymentSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = verifyPaymentSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;

    // Verify order belongs to session user
    const order = await db.order.findFirst({
      where: { id: orderId, userId: session!.user.id },
      include: { items: true },
    });
    if (!order) return err("Order not found", 404);
    if (order.paymentStatus === "PAID") return err("Order already paid", 422);
    if (order.razorpayOrderId !== razorpayOrderId) return err("Order ID mismatch", 422);

    // Verify HMAC signature — never skip this
    const valid = verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
    if (!valid) return err("Payment verification failed", 422, "SIGNATURE_MISMATCH");

    // All good — mark paid, reduce stock, clear cart in transaction
    await db.$transaction(async (tx: any) => {
      // Mark order paid
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentStatus: "PAID",
          razorpayPaymentId,
        },
      });

      // Update payment record
      await tx.payment.update({
        where: { orderId },
        data: { status: "PAID", providerPaymentId: razorpayPaymentId },
      });

      // Reduce stock for each item + log inventory
      for (const item of order.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) continue;

        const newStock = Math.max(0, product.stock - item.quantity);
        await tx.product.update({ where: { id: item.productId }, data: { stock: newStock } });
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            change: -item.quantity,
            reason: "SALE",
            previousStock: product.stock,
            newStock,
          },
        });
      }

      // Clear cart
      const cart = await tx.cart.findUnique({ where: { userId: session!.user.id } });
      if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    });

    return ok({ orderId, status: "PAID" });
  } catch (e) {
    console.error("[POST /api/payment/razorpay/verify]", e);
    return err("Payment verification failed", 500);
  }
}
