import ProudctGridSection from "@/components/products/product-grid-section";

import { getMostPopularProducts, getNewestProducts } from "@/actions/products";

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProudctGridSection
        title="Most Popular"
        productsFetcher={getMostPopularProducts}
      />
      <ProudctGridSection title="Newest" productsFetcher={getNewestProducts} />
    </main>
  );
}
