import { db } from "@/lib/db";
import { ok, err, requireAdmin } from "@/lib/api";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      revenueAll,
      revenueMonth,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      db.order.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.product.count({ where: { isActive: true } }),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
      db.order.aggregate({ where: { paymentStatus: "PAID", createdAt: { gte: monthStart } }, _sum: { total: true } }),
      db.product.findMany({
        where: { isActive: true, stock: { lte: 5 } },
        select: { id: true, name: true, stock: true, lowStockThreshold: true },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      db.order.findMany({
        include: {
          user: { select: { name: true, email: true } },
          items: { take: 1 },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return ok({
      stats: {
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        totalRevenue: revenueAll._sum.total ?? 0,
        monthRevenue: revenueMonth._sum.total ?? 0,
      },
      lowStockProducts,
      recentOrders,
    });
  } catch (e) {
    console.error("[GET /api/admin/dashboard]", e);
    return err("Failed to fetch admin dashboard", 500);
  }
}
