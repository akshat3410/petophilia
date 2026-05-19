import { db } from "@/lib/db";
import { ok, err, requireAuth } from "@/lib/api";

export async function GET() {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    const userId = session!.user.id;

    const [user, orders, subscriptions, wishlistCount] = await Promise.all([
      db.user.findUnique({ where: { id: userId }, select: { name: true, email: true, createdAt: true } }),
      db.order.findMany({
        where: { userId },
        include: { items: { take: 2 } },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      db.subscription.findMany({
        where: { userId, status: "ACTIVE" },
        include: { product: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } } },
      }),
      db.wishlist.count({ where: { userId } }),
    ]);

    const totalOrders = await db.order.count({ where: { userId } });
    const savings = await db.order.aggregate({
      where: { userId, paymentStatus: "PAID" },
      _sum: { discount: true },
    });

    return ok({
      user,
      stats: {
        totalOrders,
        activeSubscriptions: subscriptions.length,
        totalSavings: savings._sum.discount ?? 0,
        wishlistCount,
      },
      recentOrders: orders,
      subscriptions,
    });
  } catch (e) {
    console.error("[GET /api/account/dashboard]", e);
    return err("Failed to fetch dashboard", 500);
  }
}
