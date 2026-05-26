"use client";

import { useCart } from "./CartProvider";
import { useRouter } from "next/navigation";

export default function AddToCartButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const { add, has, ready } = useCart();
  const router = useRouter();
  const inCart = ready && has(slug);

  function onClick() {
    if (inCart) {
      router.push("/cart");
    } else {
      add(slug);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="add-to-cart"
      data-in-cart={inCart ? "true" : "false"}
      className={`border border-ink px-7 py-3 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper ${className}`}
    >
      {inCart ? "In cart — view" : "Acquire dossier"}
    </button>
  );
}
