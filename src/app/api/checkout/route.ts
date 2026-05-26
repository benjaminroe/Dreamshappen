import { NextResponse } from "next/server";
import { z } from "zod";
import { priceCart, createOrder } from "@/lib/orders";
import { createCheckout } from "@/lib/stripe";

const schema = z.object({
  email: z.string().email(),
  slugs: z.array(z.string()).min(1),
  code: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid email and at least one item are required." }, { status: 400 });
  }
  const { email, slugs, code } = parsed.data;

  const cart = await priceCart(
    slugs.map((slug) => ({ slug, quantity: 1 })),
    code ?? null
  );
  if (cart.items.length === 0) {
    return NextResponse.json({ error: "None of the selected items are available." }, { status: 400 });
  }

  const order = await createOrder(email, cart, null);
  // Use the live request origin so Stripe redirect URLs are always correct at
  // runtime (NEXT_PUBLIC_* values are inlined at build time and can be stale).
  const siteUrl = new URL(req.url).origin;

  try {
    const { url } = await createCheckout({ order_id: order.id, email, cart, siteUrl });
    return NextResponse.json({ url, orderId: order.id });
  } catch (err) {
    console.error("Checkout creation failed", err);
    return NextResponse.json({ error: "Unable to start checkout. Please try again." }, { status: 502 });
  }
}
