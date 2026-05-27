import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/money";
import ProductCover from "./ProductCover";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/collections/${product.slug}`}
      className="card-hover border-glow group block rounded-lg overflow-hidden"
      data-testid="product-card"
      data-slug={product.slug}
    >
      <div className="overflow-hidden">
        <ProductCover
          product={product}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="border border-t-0 border-line/40 bg-paper-dim/50 px-5 py-6 transition-colors duration-500 group-hover:bg-paper-dim/80">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold leading-tight transition-colors duration-300 group-hover:text-brass">
              {product.title}
            </h3>
            <p className="mt-2 text-sm text-stone">{product.subtitle}</p>
          </div>
          <span className="whitespace-nowrap rounded-full border border-brass/20 bg-brass/5 px-3.5 py-1.5 text-xs font-semibold tabular-nums text-brass">
            {formatMoney(product.price, product.currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}
