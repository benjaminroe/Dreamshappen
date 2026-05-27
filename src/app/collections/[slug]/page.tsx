import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, listProducts } from "@/lib/products";
import { formatMoney } from "@/lib/money";
import ProductCover from "@/components/ProductCover";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.title,
    description: product.subtitle,
    openGraph: { title: product.title, description: product.subtitle },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.published) notFound();

  const related = (await listProducts())
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.subtitle,
    brand: { "@type": "Brand", name: "Dreams Happen Ltd" },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: (product.price / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <article className="relative">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <nav className="fade-up mb-12 text-sm text-stone">
          <Link href="/collections" className="link-underline transition-colors hover:text-brass">
            The Collections
          </Link>
          <span className="mx-2 text-line">/</span>
          <span className="text-ink-soft">{product.title}</span>
        </nav>

        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div className="fade-up mx-auto w-full max-w-sm md:sticky md:top-28 md:self-start">
            <div className="float glow-pulse rounded-lg overflow-hidden">
              <ProductCover product={product} />
            </div>
          </div>

          <div className="fade-up fade-up-delay-1">
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-bar" />
              {product.collection}
            </p>
            <h1 className="mask-reveal mt-5 font-display text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
              {product.title}
            </h1>
            <p className="mt-5 text-lg text-stone">{product.subtitle}</p>

            <p className="mt-10 font-display text-4xl font-bold tabular-nums text-brass">
              {formatMoney(product.price, product.currency)}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <AddToCartButton slug={product.slug} />
              <span className="text-xs uppercase tracking-[0.2em] text-stone">
                {product.pages} pages &middot; PDF &middot; instant access
              </span>
            </div>

            <div className="prose-quiet mt-14 max-w-prose border-t border-line/40 pt-10">
              <p className="font-display text-2xl font-bold text-ink">About this dossier</p>
              <p className="mt-4">{product.description}</p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line/40 bg-line/20 sm:grid-cols-3">
              {[
                ["Format", "Digital PDF"],
                ["Length", `${product.pages} pages`],
                ["Licence", "Personal use"],
              ].map(([k, v]) => (
                <div key={k} className="spec-cell px-5 py-6">
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">{k}</p>
                  <p className="mt-2 text-sm font-medium text-ink">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-32">
            <div className="divider-glow mb-16" />
            <h2 className="reveal mb-12 font-display text-3xl font-bold md:text-4xl">Continue the architecture</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
