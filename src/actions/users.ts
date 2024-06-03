"use server";

import db from "@/db";
import { notFound } from "next/navigation";

export async function getUsers() {
  return await db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: { select: { pricePaidInCents: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteUser(id: string) {
  const user = await db.user.delete({ where: { id } });

  if (!user) return notFound();

  return user;
}
