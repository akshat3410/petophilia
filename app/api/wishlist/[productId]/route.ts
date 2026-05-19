import { db } from "@/lib/db";
import { ok, err, requireAuth } from "@/lib/api";

export async function DELETE(
  _: Request,
  { params }: { params: { productId: string } }
) {
  const { session, response } = await requireAuth();
  if (response) return response;

  try {
    await db.wishlist.deleteMany({
      where: { userId: session!.user.id, productId: params.productId },
    });
    return ok({ message: "Removed from wishlist" });
  } catch (e) {
    console.error("[DELETE /api/wishlist/[productId]]", e);
    return err("Failed to remove from wishlist", 500);
  }
}
