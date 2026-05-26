"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

type PricedItem = {
  slug: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  cover_accent: string;
};
type Priced = {
  items: PricedItem[];
  subtotalLabel: string;
  discountCode: string | null;
  discountLabel: string | null;
  totalLabel: string;
};

export default function CartPage() {
  const { items, remove, clear, ready } = useCart();
  const [priced, setPriced] = useState<Priced | null>(null);
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [codeMsg, setCodeMsg] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reprice = useCallback(
    async (slugs: string[], discount: string | null) => {
      const res = await fetch("/api/cart/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs, code: discount }),
      });
      const data = await res.json();
      setPriced(data);
      return data as Priced;
    },
    []
  );

  useEffect(() => {
    if (ready) reprice(items, appliedCode);
  }, [items, ready, appliedCode, reprice]);

  async function applyCode(e: React.FormEvent) {
    e.preventDefault();
    setCodeMsg("");
    const data = await reprice(items, code);
    if (data.discountCode) {
      setAppliedCode(data.discountCode);
      setCodeMsg(`Code ${data.discountCode} applied.`);
    } else {
      setAppliedCode(null);
      setCodeMsg("That code is not valid.");
    }
  }

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, slugs: items, code: appliedCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  }

  if (ready && items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-28 text-center">
        <p className="eyebrow">Your cart</p>
        <h1 className="mt-5 font-display text-4xl">Nothing acquired yet</h1>
        <p className="mt-5 text-ink-soft">The maps await. Begin with the Collections.</p>
        <Link
          href="/collections"
          className="mt-10 inline-block border border-ink px-8 py-3 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper"
        >
          Browse the Collections
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="eyebrow">Your cart</p>
      <h1 className="mt-5 font-display text-4xl">Review &amp; checkout</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        {/* Line items */}
        <div className="divide-y divide-line border-y border-line" data-testid="cart-items">
          {priced?.items.map((item) => (
            <div key={item.slug} className="flex items-center gap-5 py-5" data-testid="cart-line">
              <div
                className="h-20 w-15 shrink-0"
                style={{ width: 60, background: `linear-gradient(150deg, ${item.cover_accent}, rgba(0,0,0,0.4))` }}
              />
              <div className="flex-1">
                <Link href={`/collections/${item.slug}`} className="font-display text-lg link-underline">
                  {item.title}
                </Link>
                <p className="text-sm text-stone">{item.subtitle}</p>
              </div>
              <span className="tabular-nums text-ink-soft">{item.priceLabel}</span>
              <button
                onClick={() => remove(item.slug)}
                aria-label={`Remove ${item.title}`}
                className="text-xs uppercase tracking-wider text-stone hover:text-ink"
              >
                Remove
              </button>
            </div>
          ))}
          {items.length > 0 && (
            <div className="py-4">
              <button onClick={clear} className="text-xs uppercase tracking-wider text-stone hover:text-ink">
                Clear cart
              </button>
            </div>
          )}
        </div>

        {/* Summary + checkout */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-line bg-paper-dim/40 p-6">
            <form onSubmit={applyCode} className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Discount code"
                data-testid="discount-input"
                className="min-w-0 flex-1 border-b border-line bg-transparent px-1 py-2 text-sm outline-none focus:border-brass"
              />
              <button type="submit" data-testid="apply-discount" className="border border-ink px-4 py-2 text-xs uppercase tracking-wider hover:bg-ink hover:text-paper">
                Apply
              </button>
            </form>
            {codeMsg && <p data-testid="discount-msg" className="mt-2 text-xs text-brass-deep">{codeMsg}</p>}

            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone">Subtotal</dt>
                <dd className="tabular-nums">{priced?.subtotalLabel ?? "—"}</dd>
              </div>
              {priced?.discountLabel && (
                <div className="flex justify-between text-brass-deep">
                  <dt>Discount ({priced.discountCode})</dt>
                  <dd className="tabular-nums">{priced.discountLabel}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <dt>Total</dt>
                <dd className="tabular-nums" data-testid="cart-total">{priced?.totalLabel ?? "—"}</dd>
              </div>
            </dl>

            <form onSubmit={checkout} className="mt-6 space-y-3">
              <label className="block text-sm">
                <span className="mb-2 block text-stone">Email for delivery</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  data-testid="checkout-email"
                  className="w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-brass"
                />
              </label>
              {error && <p data-testid="checkout-error" className="text-xs text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={loading || items.length === 0}
                data-testid="checkout-button"
                className="w-full border border-ink bg-ink py-3 text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-transparent hover:text-ink disabled:opacity-50"
              >
                {loading ? "Redirecting…" : "Proceed to payment"}
              </button>
              <p className="text-center text-[0.65rem] text-stone">
                Secure checkout · instant access · priced in AED
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
