import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "./components/order-information";

type PurchaseReceiptEmailProps = {
  product: { name: string; description: string; imagePath: string };
  order: { id: string; pricePaidInCents: number; createdAt: Date };
  downloadVerificationId: string;
};

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: "Product Name",
    description: "asdlfkfjas",
    imagePath: "/products/1c4c7744-0171-44f4-a9c9-3fceed0e5cea-1261031 (1).jpg",
  },
  order: {
    id: crypto.randomUUID(),
    pricePaidInCents: 1000,
    createdAt: new Date(),
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              product={product}
              order={order}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
