import { getOrders } from "@/actions/orders";
import DeleteDropdownItem from "@/components/admin/orders/orders-action";
import PageHeader from "@/components/admin/page-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatter";
import { MoreVertical } from "lucide-react";

export default async function SalesPage() {
  const orders = await getOrders();

  return (
    <>
      <PageHeader>Sales</PageHeader>
      <SalesTable orders={orders} />
    </>
  );
}

type SalesTableProps = {
  orders: {
    id: string;
    pricePaidInCents: number;
    user: {
      email: string;
    };
    product: {
      name: string;
    };
  }[];
};

async function SalesTable({ orders }: SalesTableProps) {
  if (orders.length === 0) return <p>No sales found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price Paid</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.product.name}</TableCell>
            <TableCell>{order.user.email}</TableCell>
            <TableCell>
              {formatCurrency(order.pricePaidInCents / 100)}
            </TableCell>
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className="sr-only">Actions</span>
                  <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropdownItem id={order.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
