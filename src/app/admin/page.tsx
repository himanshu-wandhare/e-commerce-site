import DashboardCard from "@/components/admin/dashboard-card";

import {
  getProductsData,
  getSalesData,
  getUserData,
} from "@/actions/product-stats";

import { formatCurrency, formatNumber } from "@/lib/formatter";

export default async function AdminDashboard() {
  const [salesData, userData, productsData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductsData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(
          userData.averageValuePerUser
        )} Average Value`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title="Products"
        subtitle={`${formatNumber(productsData.inactiveProducts)} Inactive`}
        body={`${formatNumber(productsData.activeProducts)}`}
      />
    </div>
  );
}
