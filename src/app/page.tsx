import Link from "next/link";
import { listProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = (await listProducts()).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 md:pt-28">
        <div className="fade-up max-w-3xl">
          <p className="eyebrow">Dubai · Digital Publishing</p>
          <h1 className="mt-6 font-display text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
            Strategic frameworks for the global citizen.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Architecture of life, jurisdictional thinking, and long-term power. Self-directed
            dossiers for those who treat the world as a set of deliberate choices.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/collections"
              className="border border-ink bg-ink px-8 py-3 text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-transparent hover:text-ink"
            >
              Enter the Collections
            </Link>
            <Link
              href="/founder"
              className="link-underline px-1 py-3 text-sm tracking-wide text-ink-soft"
            >
              Meet the founder
            </Link>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="border-y border-line bg-paper-dim/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-12">
          <p className="eyebrow md:col-span-3">The Premise</p>
          <div className="md:col-span-9">
            <p className="font-display text-2xl leading-snug md:text-3xl">
              “We do not offer perspective. We offer the maps; you choose the destination.”
            </p>
            <p className="mt-6 max-w-2xl leading-relaxed text-ink-soft">
              Every dossier is a framework, not advice — assembled for the internationally-minded
              reader who prefers structure to sentiment. No advisory relationship. No ongoing
              obligation. Instant access, delivered the moment payment clears.
            </p>
          </div>
        </div>
      </section>

      {/* Featured collections */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Selected</p>
            <h2 className="mt-3 font-display text-3xl">From the Collections</h2>
          </div>
          <Link href="/collections" className="link-underline hidden text-sm text-ink-soft sm:block">
            View all →
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-10 sm:hidden">
          <Link href="/collections" className="link-underline text-sm text-ink-soft">
            View all →
          </Link>
        </div>
      </section>

      {/* Assurances */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
          {[
            ["Instant access", "Download your dossier the moment your payment is confirmed."],
            ["Priced in AED", "Transparent pricing for a Dubai-registered publisher."],
            ["Yours to keep", "A perpetual licence for personal use — no subscription."],
          ].map(([title, body]) => (
            <div key={title}>
              <h3 className="font-display text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
