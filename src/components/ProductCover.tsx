import type { Product } from "@/lib/types";

export default function ProductCover({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const accent = product.cover_accent || "#1f2937";
  return (
    <div
      className={`relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden p-6 text-paper shadow-sm ${className}`}
      style={{
        background: `linear-gradient(150deg, ${accent} 0%, ${accent} 55%, rgba(0,0,0,0.35) 100%)`,
      }}
    >
      <div className="flex items-center justify-between text-[0.55rem] uppercase tracking-[0.3em] text-paper/70">
        <span>Dreams Happen</span>
        <span>Dubai</span>
      </div>
      <div>
        <div className="mb-3 h-px w-10 bg-brass/80" />
        <h3 className="font-display text-2xl leading-tight">{product.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-paper/75">{product.subtitle}</p>
      </div>
      <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.25em] text-paper/60">
        <span>The Collections</span>
        <span>{product.pages} pp</span>
      </div>
    </div>
  );
}
