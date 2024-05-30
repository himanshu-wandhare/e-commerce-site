import PageHeader from "@/components/admin/page-header";
import ProductForm from "@/components/admin/products/product-form";

import { getProduct } from "@/actions/products";

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
