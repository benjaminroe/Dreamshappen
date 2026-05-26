import {
  getOrder,
  getGrantsForOrder,
  markOrderPaid,
  markOrderEmailed,
  productForGrant,
} from "./orders";
import { sendOrderConfirmation } from "./email";
import { formatMoney } from "./money";
import type { DownloadGrant } from "./types";

// Marks an order paid (idempotent) and sends the confirmation email exactly
// once. Safe to call from the simulated-checkout action, the Stripe webhook,
// and the success page.
export async function fulfillOrder(orderId: string, siteUrl: string): Promise<DownloadGrant[]> {
  const grants = await markOrderPaid(orderId);
  const order = await getOrder(orderId);
  if (!order || order.status !== "paid" || order.emailed_at) return grants;

  const links: { title: string; url: string }[] = [];
  for (const grant of grants) {
    const product = await productForGrant(grant);
    if (product) links.push({ title: product.title, url: `${siteUrl}/api/download/${grant.token}` });
  }

  await markOrderEmailed(orderId);
  await sendOrderConfirmation({
    to: order.email,
    orderId: order.id,
    total: formatMoney(order.total, order.currency),
    links,
  });

  return grants;
}
