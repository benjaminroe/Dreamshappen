import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { fulfillOrder } from "@/lib/fulfillment";

// Stripe payment confirmation webhook. Only active when STRIPE_SECRET_KEY and
// STRIPE_WEBHOOK_SECRET are configured; otherwise the simulated checkout path
// finalizes orders directly.
export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 400 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { order_id?: string } };
    const orderId = session.metadata?.order_id;
    if (orderId) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
      await fulfillOrder(orderId, siteUrl);
    }
  }

  return NextResponse.json({ received: true });
}
