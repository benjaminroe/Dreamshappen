"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

const nav = [
  { href: "/collections", label: "The Collections" },
  { href: "/founder", label: "The Founder" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { count, ready } = useCart();
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="group leading-none">
          <span className="block font-display text-2xl font-extrabold tracking-tight transition-colors group-hover:text-brass">
            Dreams Happen
          </span>
          <span className="mt-0.5 block text-[0.6rem] font-semibold uppercase tracking-[0.34em] text-stone transition-colors group-hover:text-brass/70">
            Strategic Frameworks
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="link-underline text-sm tracking-wide text-ink-soft transition-colors hover:text-brass"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="group flex items-center gap-2.5 text-sm tracking-wide text-ink-soft transition-colors hover:text-brass"
          aria-label="Cart"
        >
          <span className="link-underline">Cart</span>
          <span
            data-testid="cart-count"
            className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-brass/30 bg-brass/5 px-1.5 text-xs tabular-nums text-brass transition-all group-hover:border-brass/60 group-hover:bg-brass/10"
          >
            {ready ? count : 0}
          </span>
        </Link>
      </div>
    </header>
  );
}
