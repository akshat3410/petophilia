import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAdmin } from "@/lib/api";

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const search = req.nextUrl.searchParams.get("q");
    const status = req.nextUrl.searchParams.get("status");
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1));
    const limit = 20;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          address: { select: { city: true, state: true } },
          items: { take: 2 },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return ok({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error("[GET /api/admin/orders]", e);
    return err("Failed to fetch orders", 500);
  }
}
