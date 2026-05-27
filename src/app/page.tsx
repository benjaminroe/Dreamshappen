import Link from "next/link";
import { listProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = (await listProducts()).slice(0, 3);

  return (
    <>
      {/* Hero — full viewport, radial glow, cinematic entrance */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        {/* Floating accent orbs */}
        <div className="pointer-events-none absolute -right-32 top-1/4 h-[600px] w-[600px] rounded-full bg-brass/[0.04] blur-[150px]" />
        <div className="pointer-events-none absolute -left-20 bottom-1/4 h-[400px] w-[400px] rounded-full bg-brass/[0.03] blur-[100px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[800px] -translate-x-1/2 rounded-full bg-brass/[0.02] blur-[120px]" />

        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <p className="fade-up eyebrow flex items-center gap-3">
              <span className="gold-bar" />
              Dubai &middot; Digital Publishing
            </p>
            <h1 className="mask-reveal mt-8 font-display text-6xl font-extrabold leading-[1.04] sm:text-7xl md:text-8xl lg:text-[6.5rem]">
              <span className="gradient-text">Strategic frameworks</span>
              <br />
              <span className="text-ink">for the global citizen.</span>
            </h1>
            <p className="fade-up fade-up-delay-2 mt-10 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
              Architecture of life, jurisdictional thinking, and long-term power. Self-directed
              dossiers for those who treat the world as a set of deliberate choices.
            </p>
            <div className="fade-up fade-up-delay-3 mt-14 flex flex-wrap items-center gap-6">
              <Link href="/collections" className="btn-primary">
                Enter the Collections
              </Link>
              <Link href="/founder" className="btn-ghost">
                Meet the founder
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 fade-up fade-up-delay-4">
          <div className="flex flex-col items-center gap-2 text-stone">
            <span className="text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
            <div className="h-10 w-px animate-pulse bg-gradient-to-b from-brass/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-glow" />

      {/* Manifesto */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-radial-bottom" />
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-28 md:grid-cols-12 md:py-36">
          <div className="reveal md:col-span-3">
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-bar" />
              The Premise
            </p>
          </div>
          <div className="reveal md:col-span-9">
            <p className="font-display text-3xl font-bold leading-snug text-ink md:text-4xl lg:text-5xl">
              &ldquo;We do not offer perspective. We offer the maps;{" "}
              <span className="text-brass">you choose the destination.</span>&rdquo;
            </p>
            <div className="mt-4 gold-bar" />
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Every dossier is a framework, not advice — assembled for the internationally-minded
              reader who prefers structure to sentiment. No advisory relationship. No ongoing
              obligation. Instant access, delivered the moment payment clears.
            </p>
          </div>
        </div>
      </section>

      <div className="divider-glow" />

      {/* Featured collections */}
      <section className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
        <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-brass/[0.03] blur-[120px]" />
        <div className="reveal mb-14 flex items-end justify-between">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-bar" />
              Selected
            </p>
            <h2 className="mt-5 font-display text-4xl font-bold md:text-5xl">From the Collections</h2>
          </div>
          <Link href="/collections" className="link-underline hidden text-sm text-ink-soft sm:block">
            View all &rarr;
          </Link>
        </div>
        <div className="stagger-children grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="mt-10 sm:hidden">
          <Link href="/collections" className="link-underline text-sm text-ink-soft">
            View all &rarr;
          </Link>
        </div>
      </section>

      <div className="divider-glow" />

      {/* Assurances */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="stagger-children grid gap-8 sm:grid-cols-3">
          {[
            ["Instant access", "Download your dossier the moment your payment is confirmed. No waiting, no friction."],
            ["Priced in AED", "Transparent pricing from a Dubai-registered publisher. No hidden fees."],
            ["Yours to keep", "A perpetual licence for personal use — no subscription, no expiry, ever."],
          ].map(([title, body]) => (
            <div
              key={title}
              className="border-glow card-hover group rounded-lg bg-glass p-8"
            >
              <div className="mb-5 gold-bar transition-all duration-500 group-hover:w-16" />
              <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
