import { Product } from "@prisma/client";

import ProductCard from "./product-card";

type ProductSuspenseProps = {
  productsFetcher: () => Promise<Product[]>;
};

export async function ProductCardSuspense({
  productsFetcher,
}: ProductSuspenseProps) {
  const products = await productsFetcher();

  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
