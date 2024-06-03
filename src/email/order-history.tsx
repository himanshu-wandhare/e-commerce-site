import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "./components/order-information";
import React from "react";

type OrderHistoryEmailProps = {
  orders: {
    id: string;
    pricePaidInCents: number;
    createdAt: Date;
    downloadVerificationId: string;
    product: {
      name: string;
      imagePath: string;
      description: string;
    };
  }[];
};

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      pricePaidInCents: 3000,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product 1",
        imagePath:
          "/products/1c4c7744-0171-44f4-a9c9-3fceed0e5cea-1261031 (1).jpg",
        description: "asdffasdfa",
      },
    },
    {
      id: crypto.randomUUID(),
      pricePaidInCents: 1000,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product 2",
        imagePath:
          "/products/5f1be94d-2419-48a7-b366-c012486a2c2f-IMG_3294.JPG",
        description: "aasdfewefrvccxsdsd",
      },
    },
  ],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  product={order.product}
                  order={order}
                  downloadVerificationId={order.downloadVerificationId}
                />
                <Hr />
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
