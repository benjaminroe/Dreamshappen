import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/money";
import ProductCover from "./ProductCover";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/collections/${product.slug}`}
      className="group block"
      data-testid="product-card"
      data-slug={product.slug}
    >
      <div className="overflow-hidden">
        <ProductCover
          product={product}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-display text-lg leading-tight">{product.title}</h3>
          <p className="mt-1 text-sm text-stone">{product.subtitle}</p>
        </div>
        <span className="whitespace-nowrap text-sm tabular-nums text-ink-soft">
          {formatMoney(product.price, product.currency)}
        </span>
      </div>
    </Link>
  );
}
