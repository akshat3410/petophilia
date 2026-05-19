import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err, requireAdmin } from "@/lib/api";
import { brandSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = brandSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const brand = await db.brand.update({ where: { id: params.id }, data: parsed.data });
    return ok(brand);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2025") return err("Brand not found", 404);
    if ((e as { code?: string }).code === "P2002") return err("Slug already exists", 409);
    return err("Failed to update brand", 500);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await db.brand.update({ where: { id: params.id }, data: { isActive: false } });
    return ok({ message: "Brand deactivated" });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2025") return err("Brand not found", 404);
    return err("Failed to delete brand", 500);
  }
}
