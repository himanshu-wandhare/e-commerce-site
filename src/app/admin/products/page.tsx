import PageHeader from "@/components/admin/page-header";
import ProductsTable from "@/components/admin/products/products-table";

import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function AdminProductsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4 mb-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
}
