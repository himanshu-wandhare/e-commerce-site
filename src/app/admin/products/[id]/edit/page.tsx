import PageHeader from "@/components/admin/page-header";
import ProductForm from "@/components/admin/products/product-form";
import db from "@/db";

async function getProduct(id: string) {
  return await db.product.findUnique({ where: { id } });
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
