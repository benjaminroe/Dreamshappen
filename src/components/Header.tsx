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
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="leading-none">
          <span className="block font-display text-xl tracking-tight">Dreams Happen</span>
          <span className="mt-0.5 block text-[0.6rem] uppercase tracking-[0.34em] text-stone">
            Strategic Frameworks
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="link-underline text-sm tracking-wide text-ink-soft hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="group flex items-center gap-2 text-sm tracking-wide text-ink-soft hover:text-ink"
          aria-label="Cart"
        >
          <span className="link-underline">Cart</span>
          <span
            data-testid="cart-count"
            className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-line px-1.5 text-xs tabular-nums text-ink"
          >
            {ready ? count : 0}
          </span>
        </Link>
      </div>
    </header>
  );
}
