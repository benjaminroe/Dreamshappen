import { prisma, hasDatabaseUrl } from "./prisma";
import type { Product } from "./types";
import type { Prisma } from "@prisma/client";

// Public select — never ships the PDF bytes to list/detail views.
const productSelect = {
  id: true,
  slug: true,
  title: true,
  subtitle: true,
  collection: true,
  description: true,
  price: true,
  currency: true,
  coverAccent: true,
  pages: true,
  pdfFilename: true,
  stripeProductId: true,
  stripePriceId: true,
  published: true,
  sortOrder: true,
  createdAt: true,
} satisfies Prisma.ProductSelect;

type Row = Prisma.ProductGetPayload<{ select: typeof productSelect }>;

function toProduct(row: Row): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    collection: row.collection,
    description: row.description,
    price: row.price,
    currency: row.currency,
    cover_accent: row.coverAccent,
    pages: row.pages,
    pdf_filename: row.pdfFilename,
    stripe_product_id: row.stripeProductId,
    stripe_price_id: row.stripePriceId,
    published: row.published ? 1 : 0,
    sort_order: row.sortOrder,
    created_at: row.createdAt.toISOString(),
  };
}

export async function listProducts(
  opts: { includeUnpublished?: boolean } = {}
): Promise<Product[]> {
  if (!hasDatabaseUrl) return [];
  const rows = await prisma.product.findMany({
    where: opts.includeUnpublished ? {} : { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: productSelect,
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!hasDatabaseUrl) return undefined;
  const row = await prisma.product.findUnique({ where: { slug }, select: productSelect });
  return row ? toProduct(row) : undefined;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!hasDatabaseUrl) return undefined;
  const row = await prisma.product.findUnique({ where: { id }, select: productSelect });
  return row ? toProduct(row) : undefined;
}

export async function getProductPdf(
  id: string
): Promise<{ data: Buffer; filename: string } | null> {
  if (!hasDatabaseUrl) return null;
  const row = await prisma.product.findUnique({
    where: { id },
    select: { pdfData: true, pdfFilename: true, slug: true },
  });
  if (!row?.pdfData) return null;
  return {
    data: Buffer.from(row.pdfData),
    filename: row.pdfFilename || `${row.slug}.pdf`,
  };
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
  pdfData?: Buffer | null;
  published: number;
  sort_order: number;
};

export async function createProduct(input: ProductInput): Promise<Product> {
  const row = await prisma.product.create({
    data: {
      slug: input.slug,
      title: input.title,
      subtitle: input.subtitle,
      collection: input.collection,
      description: input.description,
      price: input.price,
      currency: "AED",
      coverAccent: input.cover_accent,
      pages: input.pages,
      pdfFilename: input.pdf_filename,
      pdfData: input.pdfData ? new Uint8Array(input.pdfData) : null,
      published: input.published === 1,
      sortOrder: input.sort_order,
    },
    select: productSelect,
  });
  return toProduct(row);
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<Product | undefined> {
  const row = await prisma.product.update({
    where: { id },
    data: {
      slug: input.slug,
      title: input.title,
      subtitle: input.subtitle,
      collection: input.collection,
      description: input.description,
      price: input.price,
      coverAccent: input.cover_accent,
      pages: input.pages,
      pdfFilename: input.pdf_filename,
      // Only replace the stored PDF when a new one was uploaded.
      ...(input.pdfData ? { pdfData: new Uint8Array(input.pdfData) } : {}),
      published: input.published === 1,
      sortOrder: input.sort_order,
    },
    select: productSelect,
  });
  return toProduct(row);
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

export async function setStripeIds(
  id: string,
  stripeProductId: string,
  stripePriceId: string
): Promise<void> {
  await prisma.product.update({ where: { id }, data: { stripeProductId, stripePriceId } });
}
