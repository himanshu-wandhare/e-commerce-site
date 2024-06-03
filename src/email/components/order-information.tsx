import { formatCurrency } from "@/lib/formatter";
import {
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";

type OrderInformationProps = {
  order: {
    id: string;
    createdAt: Date;
    pricePaidInCents: number;
  };
  product: {
    name: string;
    imagePath: string;
    description: string;
  };
  downloadVerificationId: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default function OrderInformation({
  order,
  product,
  downloadVerificationId,
}: OrderInformationProps) {
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Order ID
            </Text>
            <Text className="mt-0 mr-0">{order.id}</Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Purchased On
            </Text>
            <Text className="mt-0 mr-0">
              {dateFormatter.format(order.createdAt)}
            </Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Price Paid
            </Text>
            <Text className="mt-0 mr-0">
              {formatCurrency(order.pricePaidInCents / 100)}
            </Text>
          </Column>
        </Row>
      </Section>
      <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
        <Img
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`}
          alt={product.name}
          width="100%"
        />
        <Row className="mt-8">
          <Column className="align-bottom">
            <Row>
              <Column>
                <Text className="text-lg font-bold m-0 mr-0">
                  {product.name}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text className="text-gray-500 mb-0">
                  {product.description}
                </Text>
              </Column>
            </Row>
          </Column>
          <Column align="right">
            <Button
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/download/${downloadVerificationId}`}
              className="bg-black text-white rounded py-5 px-6 text-lg"
            >
              Download
            </Button>
          </Column>
        </Row>
      </Section>
    </>
  );
}
