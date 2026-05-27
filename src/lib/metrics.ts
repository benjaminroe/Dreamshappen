import { prisma, hasDatabaseUrl } from "./prisma";

export type DashboardMetrics = {
  totalRevenue: number;
  orderCount: number;
  paidOrders: number;
  pendingOrders: number;
  totalDownloads: number;
  subscriberCount: number;
  productCount: number;
  publishedCount: number;
  recentOrders: {
    id: string;
    email: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  topProducts: {
    title: string;
    orders: number;
    revenue: number;
  }[];
  ordersOverTime: { date: string; count: number; revenue: number }[];
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  if (!hasDatabaseUrl) {
    return {
      totalRevenue: 0, orderCount: 0, paidOrders: 0, pendingOrders: 0,
      totalDownloads: 0, subscriberCount: 0, productCount: 0, publishedCount: 0,
      recentOrders: [], topProducts: [], ordersOverTime: [],
    };
  }
  const [
    orders,
    downloads,
    subscribers,
    products,
    orderItems,
  ] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.downloadGrant.aggregate({ _sum: { downloadCount: true } }),
    prisma.subscriber.count(),
    prisma.product.findMany({ select: { id: true, published: true } }),
    prisma.orderItem.findMany({
      include: { order: { select: { status: true } } },
    }),
  ]);

  const paidOrders = orders.filter((o) => o.status === "paid");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const recentOrders = orders.slice(0, 10).map((o) => ({
    id: o.id,
    email: o.email,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  const productSales = new Map<string, { title: string; orders: number; revenue: number }>();
  for (const item of orderItems) {
    if (item.order.status !== "paid") continue;
    const existing = productSales.get(item.productId) || { title: item.title, orders: 0, revenue: 0 };
    existing.orders += 1;
    existing.revenue += item.price;
    productSales.set(item.productId, existing);
  }
  const topProducts = [...productSales.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const dailyMap = new Map<string, { count: number; revenue: number }>();
  for (const o of paidOrders) {
    const date = o.createdAt.toISOString().slice(0, 10);
    const existing = dailyMap.get(date) || { count: 0, revenue: 0 };
    existing.count += 1;
    existing.revenue += o.total;
    dailyMap.set(date, existing);
  }
  const ordersOverTime = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, data]) => ({ date, ...data }));

  return {
    totalRevenue,
    orderCount: orders.length,
    paidOrders: paidOrders.length,
    pendingOrders: pendingOrders.length,
    totalDownloads: downloads._sum.downloadCount || 0,
    subscriberCount: subscribers,
    productCount: products.length,
    publishedCount: products.filter((p) => p.published).length,
    recentOrders,
    topProducts,
    ordersOverTime,
  };
}

export async function listAllOrders() {
  if (!hasDatabaseUrl) return [];
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: { select: { title: true, slug: true } } } },
      grants: { select: { token: true, downloadCount: true, productId: true } },
    },
  });
  return orders;
}

export async function getOrderDetail(id: string) {
  if (!hasDatabaseUrl) return null;
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { id: true, title: true, slug: true, pdfFilename: true } } } },
      grants: { select: { token: true, downloadCount: true, productId: true, createdAt: true } },
    },
  });
}
