import { notFound, redirect } from "next/navigation";
import { getOrder, getOrderItems } from "@/lib/orders";
import { fulfillOrder } from "@/lib/fulfillment";
import { getSiteUrl } from "@/lib/site";
import { formatMoney } from "@/lib/money";

export const metadata = { title: "Confirm payment", robots: { index: false } };

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();
  const order = await getOrder(orderId);
  if (!order) notFound();
  if (order.status === "paid") redirect(`/checkout/success?order=${orderId}`);

  const items = await getOrderItems(orderId);

  async function pay() {
    "use server";
    const siteUrl = await getSiteUrl();
    await fulfillOrder(orderId!, siteUrl);
    redirect(`/checkout/success?order=${orderId}`);
  }

  return (
    <section className="relative mx-auto max-w-lg px-6 py-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative rounded-lg border border-line/40 bg-glass p-8">
        <p className="eyebrow">Secure checkout &middot; test mode</p>
        <h1 className="mt-4 font-display text-3xl font-bold">Confirm your order</h1>
        <p className="mt-3 text-sm text-stone">
          Stripe is not configured, so this is a simulated payment for development and testing. In
          production this step is replaced by Stripe Checkout.
        </p>

        <ul className="mt-8 divide-y divide-line/40 border-y border-line/40">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between py-3 text-sm">
              <span className="text-ink">{i.title}</span>
              <span className="tabular-nums text-brass">{formatMoney(i.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between text-base font-medium">
          <span>Total</span>
          <span className="tabular-nums text-brass">{formatMoney(order.total)}</span>
        </div>

        <form action={pay} className="mt-8">
          <button
            type="submit"
            data-testid="simulate-pay"
            className="btn-primary w-full"
          >
            Complete payment ({formatMoney(order.total)})
          </button>
        </form>
      </div>
    </section>
  );
}
