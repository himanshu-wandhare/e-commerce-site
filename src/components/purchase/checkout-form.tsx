"use client";

import { loadStripe } from "@stripe/stripe-js";

import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

import { Product } from "@prisma/client";
import { FormEvent, useState } from "react";

import { formatCurrency } from "@/lib/formatter";
import userOrderExists from "@/actions/orders";

type CheckoutFormProps = {
  product: Product;
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function CheckoutForm({
  product,
  clientSecret,
}: CheckoutFormProps) {
  return (
    <div className="max-w-md w-full mx-auto space-y-8">
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/2 relative">
          <Image src={product.imagePath} alt={product.name} fill />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-2 text-muted-foreground">
            {product.description}
          </div>
        </div>
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents} productId={product.id} />
      </Elements>
    </div>
  );
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    if (!stripe || !elements || !email) {
      setIsLoading(false);
      return;
    }

    const orderExists = await userOrderExists(email, productId);

    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product. Try to downloading it from the My Orders page."
      );
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setErrorMessage(error.message);
    } else {
      setErrorMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-2">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !stripe || !elements}
          >
            Purchase - {formatCurrency(priceInCents / 100)}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
