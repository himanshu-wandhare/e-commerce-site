import PageHeader from "@/components/admin/page-header";
import ProductForm from "@/components/admin/products/product-form";

import { getProduct } from "@/actions/products";
import db from "@/db";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  const name = await db.product.findUnique({
    where: { id },
    select: { name: true },
  });
  return {
    title: `Edit - ${name}`,
  };
}

export default async function ProductEditPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
