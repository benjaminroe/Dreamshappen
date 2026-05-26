import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getOrder,
  getGrantsForOrder,
  markOrderPaid,
  productForGrant,
} from "@/lib/orders";
import { stripe } from "@/lib/stripe";
import { formatMoney } from "@/lib/money";
import CartClearer from "@/components/CartClearer";

export const metadata = { title: "Your dossiers", robots: { index: false } };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; session_id?: string }>;
}) {
  const { order: orderId, session_id } = await searchParams;
  if (!orderId) notFound();
  let order = getOrder(orderId);
  if (!order) notFound();

  // With a live Stripe key, verify the session is paid before granting access.
  if (order.status !== "paid" && stripe && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") markOrderPaid(orderId);
    } catch {
      /* fall through to processing state */
    }
    order = getOrder(orderId)!;
  }

  if (order.status !== "paid") {
    return (
      <section className="mx-auto max-w-lg px-6 py-28 text-center">
        <p className="eyebrow">Almost there</p>
        <h1 className="mt-4 font-display text-3xl">Confirming your payment…</h1>
        <p className="mt-4 text-ink-soft">
          Your payment is being confirmed. This page will show your download links once it clears —
          please refresh in a moment.
        </p>
      </section>
    );
  }

  const grants = getGrantsForOrder(orderId);

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <CartClearer />
      <p className="eyebrow">Payment received</p>
      <h1 className="mt-5 font-display text-4xl">Your dossiers are ready</h1>
      <p className="mt-5 leading-relaxed text-ink-soft">
        Thank you. A perpetual licence has been granted to{" "}
        <span className="text-ink">{order.email}</span>. Download your files below — your links
        remain available on this confirmation.
      </p>

      <ul className="mt-12 divide-y divide-line border-y border-line" data-testid="download-list">
        {grants.map((g) => {
          const product = productForGrant(g);
          if (!product) return null;
          return (
            <li key={g.token} className="flex items-center justify-between gap-4 py-5">
              <div>
                <p className="font-display text-lg">{product.title}</p>
                <p className="text-sm text-stone">{product.pages} pages · PDF</p>
              </div>
              <a
                href={`/api/download/${g.token}`}
                data-testid="download-link"
                className="border border-ink px-6 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper"
              >
                Download
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex items-center justify-between text-sm">
        <span className="text-stone">Order {order.id.slice(0, 8)} · {formatMoney(order.total)}</span>
        <Link href="/collections" className="link-underline text-ink-soft">
          Continue exploring →
        </Link>
      </div>
    </section>
  );
}
