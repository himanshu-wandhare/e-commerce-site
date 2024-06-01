"use server";

import db from "@/db";
import { notFound } from "next/navigation";

export async function deleteOrder(id: string) {
  const order = await db.order.delete({
    where: { id },
  });

  if (!order) return notFound();

  return order;
}

export async function userOrderExists(email: string, productId: string) {
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

export async function createDownloadVerification(productId: string) {
  return (
    await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  ).id;
}
