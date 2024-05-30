import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";

import Link from "next/link";
import { Suspense } from "react";

import ProductCardSkeleton from "./product-card-skeletion";
import { ProductCardSuspense } from "./product-card-suspense";

type ProudctGridSectionProps = {
  title: string;
  productsFetcher: () => Promise<Product[]>;
};

export default function ProudctGridSection({
  title,
  productsFetcher,
}: ProudctGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link className="space-x-2" href="/products">
            <span>View all</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductCardSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}
