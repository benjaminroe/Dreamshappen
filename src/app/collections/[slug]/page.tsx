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

  return (
    <article className="mx-auto max-w-6xl px-6 py-16">
      <nav className="mb-10 text-sm text-stone">
        <Link href="/collections" className="link-underline">
          The Collections
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-soft">{product.title}</span>
      </nav>

      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="mx-auto w-full max-w-sm md:sticky md:top-28 md:self-start">
          <ProductCover product={product} />
        </div>

        <div>
          <p className="eyebrow">{product.collection}</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{product.title}</h1>
          <p className="mt-4 text-lg text-stone">{product.subtitle}</p>

          <p className="mt-8 text-2xl tabular-nums">{formatMoney(product.price, product.currency)}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <AddToCartButton slug={product.slug} />
            <span className="text-xs uppercase tracking-[0.2em] text-stone">
              {product.pages} pages · PDF · instant access
            </span>
          </div>

          <div className="prose-quiet mt-12 max-w-prose border-t border-line pt-10">
            <p className="font-display text-xl text-ink">About this dossier</p>
            <p className="mt-4">{product.description}</p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {[
              ["Format", "Digital PDF"],
              ["Length", `${product.pages} pages`],
              ["Licence", "Personal use"],
            ].map(([k, v]) => (
              <div key={k} className="bg-paper px-5 py-4">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">{k}</p>
                <p className="mt-1 text-sm text-ink">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28 border-t border-line pt-14">
          <h2 className="mb-10 font-display text-2xl">Continue the architecture</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
