import { getDb } from "./db";
import type { Product } from "./types";
import { randomUUID } from "node:crypto";

export function listProducts(opts: { includeUnpublished?: boolean } = {}): Product[] {
  const db = getDb();
  const where = opts.includeUnpublished ? "" : "WHERE published = 1";
  return db
    .prepare(`SELECT * FROM products ${where} ORDER BY sort_order ASC, created_at ASC`)
    .all() as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return getDb().prepare("SELECT * FROM products WHERE slug = ?").get(slug) as
    | Product
    | undefined;
}

export function getProductById(id: string): Product | undefined {
  return getDb().prepare("SELECT * FROM products WHERE id = ?").get(id) as
    | Product
    | undefined;
}

export type ProductInput = {
  slug: string;
  title: string;
  subtitle: string;
  collection: string;
  description: string;
  price: number;
  cover_accent: string;
  pages: number;
  pdf_filename: string | null;
  published: number;
  sort_order: number;
};

export function createProduct(input: ProductInput): Product {
  const db = getDb();
  const id = randomUUID();
  db.prepare(
    `INSERT INTO products (id, slug, title, subtitle, collection, description, price, currency, cover_accent, pages, pdf_filename, published, sort_order)
     VALUES (@id, @slug, @title, @subtitle, @collection, @description, @price, 'AED', @cover_accent, @pages, @pdf_filename, @published, @sort_order)`
  ).run({ id, ...input });
  return getProductById(id)!;
}

export function updateProduct(id: string, input: ProductInput): Product | undefined {
  const db = getDb();
  db.prepare(
    `UPDATE products SET slug=@slug, title=@title, subtitle=@subtitle, collection=@collection,
       description=@description, price=@price, cover_accent=@cover_accent, pages=@pages,
       pdf_filename=@pdf_filename, published=@published, sort_order=@sort_order
     WHERE id=@id`
  ).run({ id, ...input });
  return getProductById(id);
}

export function deleteProduct(id: string): void {
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
}
