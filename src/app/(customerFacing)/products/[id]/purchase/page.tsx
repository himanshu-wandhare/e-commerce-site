import Stripe from "stripe";

import { notFound } from "next/navigation";
import { getProduct } from "@/actions/products";
import CheckoutForm from "@/components/purchase/checkout-form";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function ProductPurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);

  if (!product) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: { productId: product.id },
  });

  if (!paymentIntent.client_secret) {
    throw Error("Stripe failed to create payment intent.");
  }

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
