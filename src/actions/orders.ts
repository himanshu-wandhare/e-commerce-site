"use server";

import db from "@/db";

export default async function userOrderExists(
  email: string,
  productId: string
) {
  return (
    (await db.order.findFirst({
      where: {
        user: { email },
        productId,
      },
      select: { id: true },
    })) != null
  );
}
