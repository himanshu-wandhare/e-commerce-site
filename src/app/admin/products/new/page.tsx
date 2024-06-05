import PageHeader from "@/components/admin/page-header";
import ProductForm from "@/components/admin/products/product-form";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product",
};

export default function ProductsNewPage() {
  return (
    <>
      <PageHeader>Add Product</PageHeader>
      <ProductForm />
    </>
  );
}
