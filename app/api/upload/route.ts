import { NextRequest } from "next/server";
import { ok, err, requireAdmin } from "@/lib/api";
import { getSignedUploadParams } from "@/lib/cloudinary";
import { z } from "zod";

const schema = z.object({ folder: z.string().optional() });

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    const folder = parsed.success ? parsed.data.folder : undefined;

    const params = getSignedUploadParams(folder);
    return ok(params);
  } catch (e) {
    console.error("[POST /api/upload]", e);
    return err("Failed to generate upload signature", 500);
  }
}
