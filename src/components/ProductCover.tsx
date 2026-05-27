import type { Product } from "@/lib/types";

export default function ProductCover({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const accent = product.cover_accent || "#d4a853";
  return (
    <div
      className={`relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden p-6 text-paper ${className}`}
      style={{
        background: `linear-gradient(160deg, ${accent} 0%, #0a0a0f 70%, #0a0a0f 100%)`,
      }}
    >
      {/* Subtle glow orb from accent */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full blur-[80px] opacity-30"
        style={{ background: accent }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full blur-[60px] opacity-10"
        style={{ background: accent }}
      />

      <div className="relative flex items-center justify-between text-[0.55rem] uppercase tracking-[0.3em] text-paper/60">
        <span>Dreams Happen</span>
        <span>Dubai</span>
      </div>
      <div className="relative">
        <div className="mb-3 h-px w-10" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        <h3 className="font-display text-3xl font-extrabold leading-tight drop-shadow-lg">{product.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-paper/65">{product.subtitle}</p>
      </div>
      <div className="relative flex items-center justify-between text-[0.6rem] uppercase tracking-[0.25em] text-paper/50">
        <span>The Collections</span>
        <span>{product.pages} pp</span>
      </div>
    </div>
  );
}
