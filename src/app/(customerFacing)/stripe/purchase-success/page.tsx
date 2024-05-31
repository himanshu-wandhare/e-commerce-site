import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";

import { getProduct } from "@/actions/products";
import { createDownloadVerification } from "@/actions/orders";
import { formatCurrency } from "@/lib/formatter";
import { notFound } from "next/navigation";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchaseSuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );

  if (!paymentIntent) return notFound();

  const product = await getProduct(paymentIntent.metadata.productId);

  if (!product) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <>
      <div className="max-w-5xl w-full mx-auto space-y-8">
        <h1
          className={`text-4xl font-bold ${
            !isSuccess ? "text-destructive" : ""
          }`}
        >
          {isSuccess ? "Success!" : "Error!"}
        </h1>
        <div className="flex gap-4 items-center">
          <div className="relative w-1/3 aspect-video flex-shrink-0">
            <Image
              src={product.imagePath}
              alt={product.name}
              className="object-cover"
              fill
            />
          </div>
          <div>
            <div className="text-lg">
              {formatCurrency(product.priceInCents / 100)}
            </div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="line-clamp-3 text-muted-foreground">
              {product.description}
            </div>
            <Button className="mt-4" size="lg" asChild>
              {isSuccess ? (
                <a
                  href={`/products/download/${await createDownloadVerification(
                    product.id
                  )}`}
                >
                  Download
                </a>
              ) : (
                <Link href={`/proudcts/${product.id}/purchase`}>Try Again</Link>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
