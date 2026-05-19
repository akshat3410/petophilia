import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAdmin } from "@/lib/api";

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const search = req.nextUrl.searchParams.get("q");
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1));
    const limit = 20;

    const where: Record<string, unknown> = { role: "CUSTOMER" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [customers, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, phone: true, createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return ok({ customers, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch customers", 500);
  }
}
