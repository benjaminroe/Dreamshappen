"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type CartContextValue = {
  items: string[]; // product slugs (each digital title bought once)
  add: (slug: string) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
  count: number;
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dh_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = useCallback((slug: string) => {
    setItems((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);
  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((s) => s !== slug));
  }, []);
  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((slug: string) => items.includes(slug), [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, has, clear, count: items.length, ready }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
