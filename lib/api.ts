import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { Role } from "@prisma/client";

// ── Consistent API response shapes ────────────────────────────────────────
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function err(message: string, status = 400, code?: string) {
  return NextResponse.json({ success: false, error: message, code }, { status });
}

// ── Auth helpers ───────────────────────────────────────────────────────────
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, response: err("Unauthorized", 401) };
  }
  return { session, response: null };
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, response: err("Unauthorized", 401) };
  }
  if (session.user.role !== ("ADMIN" as Role)) {
    return { session: null, response: err("Forbidden", 403) };
  }
  return { session, response: null };
}

// ── Generate order number ──────────────────────────────────────────────────
export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PT-${ts}${rand}`;
}

// ── Paise helpers ─────────────────────────────────────────────────────────
/** Display paise as ₹ */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/** Convert rupees float to paise int */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}
