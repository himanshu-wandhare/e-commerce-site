import { Suspense } from "react";

import ProductCardSkeleton from "@/components/products/product-card-skeletion";
import { ProductCardSuspense } from "@/components/products/product-card-suspense";

import { getProducts } from "@/actions/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductCardSuspense productsFetcher={getProducts} />
      </Suspense>
    </div>
  );
}
