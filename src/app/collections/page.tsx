import type { Metadata } from "next";
import { listProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "The Collections",
  description:
    "Strategic frameworks for the global citizen — the complete library of digital dossiers from Dreams Happen Ltd.",
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const products = await listProducts();

  return (
    <section className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute inset-0 bg-grid" />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="fade-up max-w-2xl">
          <p className="eyebrow flex items-center gap-3">
            <span className="gold-bar" />
            The Collections
          </p>
          <h1 className="mask-reveal mt-6 font-display text-5xl font-extrabold md:text-6xl lg:text-7xl">
            <span className="gradient-text">The complete library</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Self-directed frameworks on jurisdiction, structure, and long-term power. Each is a
            digital dossier — delivered instantly, yours to keep.
          </p>
        </div>

        <div className="stagger-children mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="mt-14 text-stone">The collection is being prepared. Please check back soon.</p>
        )}
      </div>
    </section>
  );
}
