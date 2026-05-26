import { notFound, redirect } from "next/navigation";
import { getOrder, getOrderItems, markOrderPaid } from "@/lib/orders";
import { formatMoney } from "@/lib/money";

export const metadata = { title: "Confirm payment", robots: { index: false } };

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();
  const order = getOrder(orderId);
  if (!order) notFound();
  if (order.status === "paid") redirect(`/checkout/success?order=${orderId}`);

  const items = getOrderItems(orderId);

  async function pay() {
    "use server";
    markOrderPaid(orderId!);
    redirect(`/checkout/success?order=${orderId}`);
  }

  return (
    <section className="mx-auto max-w-lg px-6 py-24">
      <div className="border border-line bg-paper-dim/40 p-8">
        <p className="eyebrow">Secure checkout · test mode</p>
        <h1 className="mt-4 font-display text-3xl">Confirm your order</h1>
        <p className="mt-3 text-sm text-stone">
          Stripe is not configured, so this is a simulated payment for development and testing. In
          production this step is replaced by Stripe Checkout.
        </p>

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between py-3 text-sm">
              <span>{i.title}</span>
              <span className="tabular-nums text-ink-soft">{formatMoney(i.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between text-base">
          <span>Total</span>
          <span className="tabular-nums">{formatMoney(order.total)}</span>
        </div>

        <form action={pay} className="mt-8">
          <button
            type="submit"
            data-testid="simulate-pay"
            className="w-full border border-ink bg-ink py-3 text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-transparent hover:text-ink"
          >
            Complete payment ({formatMoney(order.total)})
          </button>
        </form>
      </div>
    </section>
  );
}
