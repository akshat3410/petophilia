import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAdmin } from "@/lib/api";
import { categorySchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const cat = await db.category.update({ where: { id: params.id }, data: parsed.data });
    return ok(cat);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2025") return err("Category not found", 404);
    if ((e as { code?: string }).code === "P2002") return err("Slug already exists", 409);
    return err("Failed to update category", 500);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await db.category.update({ where: { id: params.id }, data: { isActive: false } });
    return ok({ message: "Category deactivated" });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2025") return err("Category not found", 404);
    return err("Failed to delete category", 500);
  }
}
