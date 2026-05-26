import { getDb } from "./db";
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
export function priceCart(
  lines: { slug: string; quantity: number }[],
  discountCode?: string | null
): PricedCart {
  const items: { product: Product; price: number }[] = [];
  for (const line of lines) {
    const product = getProductBySlug(line.slug);
    if (!product || !product.published) continue;
    // Digital goods: quantity is always 1 per title.
    items.push({ product, price: product.price });
  }
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);

  let discountAmount = 0;
  let appliedCode: string | null = null;
  if (discountCode) {
    const discount = lookupDiscount(discountCode);
    if (discount) {
      appliedCode = discount.code;
      discountAmount = Math.round((subtotal * discount.percent_off) / 100);
    }
  }
  const total = Math.max(0, subtotal - discountAmount);
  return { items, subtotal, discountCode: appliedCode, discountAmount, total };
}

export function createOrder(
  email: string,
  cart: PricedCart,
  stripeSessionId: string | null
): Order {
  const db = getDb();
  const id = randomUUID();
  const insertOrder = db.prepare(
    `INSERT INTO orders (id, email, status, total, currency, discount_code, stripe_session_id)
     VALUES (?, ?, 'pending', ?, 'AED', ?, ?)`
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (id, order_id, product_id, title, price) VALUES (?, ?, ?, ?, ?)`
  );
  const tx = db.transaction(() => {
    insertOrder.run(id, email, cart.total, cart.discountCode, stripeSessionId);
    for (const { product, price } of cart.items) {
      insertItem.run(randomUUID(), id, product.id, product.title, price);
    }
  });
  tx();
  return getOrder(id)!;
}

export function getOrder(id: string): Order | undefined {
  return getDb().prepare("SELECT * FROM orders WHERE id = ?").get(id) as Order | undefined;
}

export function getOrderByStripeSession(sessionId: string): Order | undefined {
  return getDb()
    .prepare("SELECT * FROM orders WHERE stripe_session_id = ?")
    .get(sessionId) as Order | undefined;
}

export function getOrderItems(orderId: string): OrderItem[] {
  return getDb()
    .prepare("SELECT * FROM order_items WHERE order_id = ?")
    .all(orderId) as OrderItem[];
}

// Idempotently mark an order paid and mint one download grant per item.
export function markOrderPaid(orderId: string): DownloadGrant[] {
  const db = getDb();
  const order = getOrder(orderId);
  if (!order) return [];
  if (order.status === "paid") return getGrantsForOrder(orderId);

  const items = getOrderItems(orderId);
  const insertGrant = db.prepare(
    `INSERT INTO download_grants (token, order_id, product_id) VALUES (?, ?, ?)`
  );
  const tx = db.transaction(() => {
    db.prepare("UPDATE orders SET status = 'paid' WHERE id = ?").run(orderId);
    for (const item of items) {
      insertGrant.run(randomUUID().replace(/-/g, ""), orderId, item.product_id);
    }
  });
  tx();
  return getGrantsForOrder(orderId);
}

export function getGrantsForOrder(orderId: string): DownloadGrant[] {
  return getDb()
    .prepare("SELECT * FROM download_grants WHERE order_id = ?")
    .all(orderId) as DownloadGrant[];
}

export function getGrant(token: string): DownloadGrant | undefined {
  return getDb()
    .prepare("SELECT * FROM download_grants WHERE token = ?")
    .get(token) as DownloadGrant | undefined;
}

export function recordDownload(token: string): void {
  getDb()
    .prepare("UPDATE download_grants SET download_count = download_count + 1 WHERE token = ?")
    .run(token);
}

export function productForGrant(grant: DownloadGrant): Product | undefined {
  return getProductById(grant.product_id);
}
