import PageHeader from "@/components/admin/page-header";
import DeleteDropdownItem from "@/components/admin/users/user-actions";
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
import { getUsers } from "@/actions/users";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import { MoreVertical } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function UsersPage() {
  const users = await getUsers();
  return (
    <>
      <PageHeader>Customers</PageHeader>
      <UsersTable users={users} />
    </>
  );
}

type UserTableProps = {
  users: {
    id: string;
    orders: {
      pricePaidInCents: number;
    }[];
    email: string;
  }[];
};

async function UsersTable({ users }: UserTableProps) {
  if (users.length === 0) return <p>No products found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatNumber(user.orders.length)}</TableCell>
            <TableCell>
              {formatCurrency(
                user.orders.reduce((sum, o) => o.pricePaidInCents + sum, 0) /
                  100
              )}
            </TableCell>
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className="sr-only">Actions</span>
                  <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropdownItem id={user.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
