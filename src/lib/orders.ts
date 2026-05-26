import { prisma } from "./prisma";
import { getProductBySlug, getProductById } from "./products";
import { lookupDiscount } from "./marketing";
import type { Order, OrderItem, DownloadGrant, Product } from "./types";
import { randomUUID } from "node:crypto";

export type PricedCart = {
  items: { product: Product; price: number }[];
  subtotal: number;
  discountCode: string | null;
  discountAmount: number;
  total: number;
};

// Re-prices a cart from authoritative DB data — never trust client prices.
export async function priceCart(
  lines: { slug: string; quantity: number }[],
  discountCode?: string | null
): Promise<PricedCart> {
  const items: { product: Product; price: number }[] = [];
  for (const line of lines) {
    const product = await getProductBySlug(line.slug);
    if (!product || !product.published) continue;
    items.push({ product, price: product.price });
  }
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);

  let discountAmount = 0;
  let appliedCode: string | null = null;
  if (discountCode) {
    const discount = await lookupDiscount(discountCode);
    if (discount) {
      appliedCode = discount.code;
      discountAmount = Math.round((subtotal * discount.percent_off) / 100);
    }
  }
  const total = Math.max(0, subtotal - discountAmount);
  return { items, subtotal, discountCode: appliedCode, discountAmount, total };
}

function mapOrder(row: {
  id: string;
  email: string;
  status: string;
  total: number;
  currency: string;
  discountCode: string | null;
  stripeSessionId: string | null;
  emailedAt: Date | null;
  createdAt: Date;
}): Order {
  return {
    id: row.id,
    email: row.email,
    status: row.status as Order["status"],
    total: row.total,
    currency: row.currency,
    discount_code: row.discountCode,
    stripe_session_id: row.stripeSessionId,
    emailed_at: row.emailedAt ? row.emailedAt.toISOString() : null,
    created_at: row.createdAt.toISOString(),
  };
}

export async function createOrder(
  email: string,
  cart: PricedCart,
  stripeSessionId: string | null
): Promise<Order> {
  const row = await prisma.order.create({
    data: {
      email,
      status: "pending",
      total: cart.total,
      currency: "AED",
      discountCode: cart.discountCode,
      stripeSessionId,
      items: {
        create: cart.items.map(({ product, price }) => ({
          productId: product.id,
          title: product.title,
          price,
        })),
      },
    },
  });
  return mapOrder(row);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const row = await prisma.order.findUnique({ where: { id } });
  return row ? mapOrder(row) : undefined;
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const rows = await prisma.orderItem.findMany({ where: { orderId } });
  return rows.map((r) => ({
    id: r.id,
    order_id: r.orderId,
    product_id: r.productId,
    title: r.title,
    price: r.price,
  }));
}

// Idempotently mark an order paid and mint one download grant per item.
export async function markOrderPaid(orderId: string): Promise<DownloadGrant[]> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return [];
  if (order.status === "paid") return getGrantsForOrder(orderId);

  const items = await prisma.orderItem.findMany({ where: { orderId } });
  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: "paid" } }),
    ...items.map((item) =>
      prisma.downloadGrant.create({
        data: {
          token: randomUUID().replace(/-/g, ""),
          orderId,
          productId: item.productId,
        },
      })
    ),
  ]);
  return getGrantsForOrder(orderId);
}

export async function markOrderEmailed(orderId: string): Promise<void> {
  await prisma.order.update({ where: { id: orderId }, data: { emailedAt: new Date() } });
}

function mapGrant(r: {
  token: string;
  orderId: string;
  productId: string;
  downloadCount: number;
  createdAt: Date;
}): DownloadGrant {
  return {
    token: r.token,
    order_id: r.orderId,
    product_id: r.productId,
    download_count: r.downloadCount,
    created_at: r.createdAt.toISOString(),
  };
}

export async function getGrantsForOrder(orderId: string): Promise<DownloadGrant[]> {
  const rows = await prisma.downloadGrant.findMany({ where: { orderId } });
  return rows.map(mapGrant);
}

export async function getGrant(token: string): Promise<DownloadGrant | undefined> {
  const row = await prisma.downloadGrant.findUnique({ where: { token } });
  return row ? mapGrant(row) : undefined;
}

export async function recordDownload(token: string): Promise<void> {
  await prisma.downloadGrant.update({
    where: { token },
    data: { downloadCount: { increment: 1 } },
  });
}

export async function productForGrant(grant: DownloadGrant): Promise<Product | undefined> {
  return getProductById(grant.product_id);
}
