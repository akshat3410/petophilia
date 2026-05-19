import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAdmin } from "@/lib/api";
import { categorySchema } from "@/lib/validations";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return ok(categories);
  } catch (e) {
    console.error(e);
    return err("Failed to fetch categories", 500);
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const cat = await db.category.create({ data: parsed.data });
    return ok(cat, 201);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return err("Slug already exists", 409);
    return err("Failed to create category", 500);
  }
}
