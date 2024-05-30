import db from "@/db";

export async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

export async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
}

export async function getProductsData() {
  const [activeProducts, inactiveProducts] = await Promise.all([
    db.product.count({ where: { isAvaialableForPurchase: true } }),
    db.product.count({ where: { isAvaialableForPurchase: false } }),
  ]);

  return { activeProducts, inactiveProducts };
}

export async function getProducts() {
  return await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvaialableForPurchase: true,
      _count: { select: { orders: true } },
    },
  });
}
