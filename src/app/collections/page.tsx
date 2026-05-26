import type { Metadata } from "next";
import { listProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "The Collections",
  description:
    "Strategic frameworks for the global citizen — the complete library of digital dossiers from Dreams Happen Ltd.",
};

export const dynamic = "force-dynamic";

export default function CollectionsPage() {
  const products = listProducts();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-2xl">
        <p className="eyebrow">The Collections</p>
        <h1 className="mt-5 font-display text-4xl md:text-5xl">The complete library</h1>
        <p className="mt-6 leading-relaxed text-ink-soft">
          Self-directed frameworks on jurisdiction, structure, and long-term power. Each is a
          digital dossier — delivered instantly, yours to keep.
        </p>
      </div>

      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-14 text-stone">The collection is being prepared. Please check back soon.</p>
      )}
    </section>
  );
}
