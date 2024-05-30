"use server";

import db from "@/db";

import fs from "fs/promises";
import { z } from "zod";
import { cache } from "@/lib/cache";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const productSchema = z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().min(1),
  description: z.string().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(prevValue: unknown, formData: FormData) {
  const result = productSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await db.product.create({
    data: {
      name: data.name,
      priceInCents: data.priceInCents,
      description: data.description,
      isAvaialableForPurchase: false,
      filePath,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

const editProductSchema = productSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function editProduct(
  id: string,
  prevValue: unknown,
  formData: FormData
) {
  const result = editProductSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });

  if (!product) return notFound();

  let filePath = product.filePath;
  if (data.file && data.file.size > 0) {
    await fs.unlink(product.filePath);
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
  }

  let imagePath = product.imagePath;
  if (data.image && data.image.size > 0) {
    await fs.unlink(`public${product.imagePath}`);
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      priceInCents: data.priceInCents,
      description: data.description,
      filePath,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });

  if (!product || product == null) return notFound();

  await fs.unlink(product.filePath);
  await fs.unlink(`public${product.imagePath}`);

  revalidatePath("/");
  revalidatePath("/products");
}

export const getProducts = cache(async () => {
  return await db.product.findMany({
    where: { isAvaialableForPurchase: true },
    orderBy: { name: "asc" },
  });
}, ["/", "getProducts"]);

export async function getProduct(id: string) {
  return await db.product.findUnique({ where: { id } });
}

export const getMostPopularProducts = cache(
  async () => {
    return await db.product.findMany({
      where: { isAvaialableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
    });
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

export const getNewestProducts = cache(async () => {
  return await db.product.findMany({
    where: { isAvaialableForPurchase: true },
    orderBy: { createdAt: "desc" },
  });
}, ["/", "getNewestProducts"]);

export async function toggleProductAvailability(
  id: string,
  isAvaialableForPurchase: boolean
) {
  await db.product.update({ where: { id }, data: { isAvaialableForPurchase } });

  revalidatePath("/");
  revalidatePath("/products");
}
