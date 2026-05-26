import Stripe from "stripe";
import type { PricedCart } from "./orders";

const KEY = process.env.STRIPE_SECRET_KEY;

// Stripe is "live" only when a real-looking secret key is configured. Without
// one, the app falls back to a self-contained simulated checkout so the full
// purchase -> download flow works in dev and e2e tests.
export const stripeEnabled = Boolean(KEY && KEY.startsWith("sk_"));

export const stripe: Stripe | null = stripeEnabled ? new Stripe(KEY as string) : null;

export type CheckoutResult = { url: string; sessionId: string | null };

export async function createCheckout(params: {
  order_id: string;
  email: string;
  cart: PricedCart;
  siteUrl: string;
}): Promise<CheckoutResult> {
  const { order_id, email, cart, siteUrl } = params;

  if (stripe) {
    // Distribute any percentage discount proportionally across line items so
    // the Stripe total matches the order total without needing a Coupon object.
    const factor = cart.subtotal > 0 ? cart.total / cart.subtotal : 1;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: cart.items.map((i) => ({
        quantity: 1,
        price_data: {
          currency: "aed",
          unit_amount: Math.max(0, Math.round(i.price * factor)),
          product_data: { name: i.product.title, description: i.product.subtitle },
        },
      })),
      metadata: { order_id },
      success_url: `${siteUrl}/checkout/success?order=${order_id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart?cancelled=1`,
    });
    return { url: session.url ?? `${siteUrl}/checkout/success?order=${order_id}`, sessionId: session.id };
  }

  // Simulated checkout — confirms the order without leaving the site. A
  // relative URL keeps this correct regardless of host/port.
  void siteUrl;
  return {
    url: `/checkout/confirm?order=${order_id}`,
    sessionId: null,
  };
}
