import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrder, getGrantsForOrder, productForGrant } from "@/lib/orders";
import { fulfillOrder } from "@/lib/fulfillment";
import { getSiteUrl } from "@/lib/site";
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
  let order = await getOrder(orderId);
  if (!order) notFound();

  // With a live Stripe key, verify the session is paid before granting access.
  if (order.status !== "paid" && stripe && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        await fulfillOrder(orderId, await getSiteUrl());
      }
    } catch {
      /* fall through to processing state */
    }
    order = (await getOrder(orderId))!;
  }

  if (order.status !== "paid") {
    return (
      <section className="relative mx-auto max-w-lg px-6 py-32 text-center">
        <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
        <div className="relative">
          <p className="eyebrow">Almost there</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Confirming your payment...</h1>
          <p className="mt-4 text-ink-soft">
            Your payment is being confirmed. This page will show your download links once it clears —
            please refresh in a moment.
          </p>
        </div>
      </section>
    );
  }

  const grants = await getGrantsForOrder(orderId);
  const downloads = (
    await Promise.all(
      grants.map(async (g) => {
        const product = await productForGrant(g);
        return product ? { token: g.token, title: product.title, pages: product.pages } : null;
      })
    )
  ).filter((d): d is { token: string; title: string; pages: number } => d !== null);

  return (
    <section className="relative mx-auto max-w-2xl px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative">
        <CartClearer />
        <p className="eyebrow flex items-center gap-3">
          <span className="gold-bar" />
          Payment received
        </p>
        <h1 className="mask-reveal mt-6 font-display text-5xl font-extrabold">
          <span className="gradient-text">Your dossiers are ready</span>
        </h1>
        <p className="mt-6 leading-relaxed text-ink-soft">
          Thank you. A perpetual licence has been granted to{" "}
          <span className="text-brass">{order.email}</span>. Download your files below — your links
          remain available on this confirmation.
        </p>

        <ul className="mt-12 divide-y divide-line/40 border-y border-line/40" data-testid="download-list">
          {downloads.map((d) => (
            <li key={d.token} className="group flex items-center justify-between gap-4 py-6 transition-colors hover:bg-glass">
              <div>
                <p className="font-display text-lg transition-colors group-hover:text-brass">{d.title}</p>
                <p className="text-sm text-stone">{d.pages} pages &middot; PDF</p>
              </div>
              <a
                href={`/api/download/${d.token}`}
                data-testid="download-link"
                className="btn-primary !py-2.5 !px-6"
              >
                Download
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center justify-between text-sm">
          <span className="text-stone">Order {order.id.slice(0, 8)} &middot; {formatMoney(order.total)}</span>
          <Link href="/collections" className="link-underline text-ink-soft transition-colors hover:text-brass">
            Continue exploring &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
