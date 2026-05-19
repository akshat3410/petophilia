import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, err } from "@/lib/api";
import { registerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.message);

    const { name, email, password } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return err("Email already registered", 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: { name, email, passwordHash, role: "CUSTOMER" },
      select: { id: true, name: true, email: true, role: true },
    });

    return ok(user, 201);
  } catch (e) {
    console.error("[POST /api/auth/register]", e);
    return err("Registration failed", 500);
  }
}
