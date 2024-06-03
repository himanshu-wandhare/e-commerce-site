"use server";

import db from "@/db";
import OrderHistoryEmail from "@/email/order-history";
import { notFound } from "next/navigation";
import { Resend } from "resend";
import { z } from "zod";

export async function getOrders() {
  return await db.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      product: { select: { name: true } },
      user: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

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

const emailSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function emailOrderHistory(
  prevValue: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"));

  if (!result.success) {
    return {
      error: "Invalid email address",
    };
  }

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          id: true,
          pricePaidInCents: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return {
      message:
        "Check your email to view your order history and download your products.",
    };
  }

  const orders = await Promise.all(
    user.orders.map(async (order) => ({
      ...order,
      downloadVerificationId: await createDownloadVerification(
        order.product.id
      ),
    }))
  );

  const { error } = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistoryEmail orders={orders} />,
  });

  if (error) {
    return {
      error: "There was an error sending your email. Please try again.",
    };
  }

  return {
    message:
      "Check your email to view your order history and download your products.",
  };
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
