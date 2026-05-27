import { prisma, hasDatabaseUrl } from "./prisma";

// --- Marketing: newsletter / lead capture -------------------------------
export async function addSubscriber(email: string, source = "footer"): Promise<boolean> {
  if (!hasDatabaseUrl) return false;
  const normalized = email.trim().toLowerCase();
  const existing = await prisma.subscriber.findUnique({ where: { email: normalized } });
  if (existing) return false;
  await prisma.subscriber.create({ data: { email: normalized, source } });
  return true;
}

export async function listSubscribers(): Promise<
  { email: string; source: string; created_at: string }[]
> {
  if (!hasDatabaseUrl) return [];
  const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({ email: r.email, source: r.source, created_at: r.createdAt.toISOString() }));
}

// --- Sales: discount codes ----------------------------------------------
export type Discount = { code: string; percent_off: number; active: number };

export async function lookupDiscount(code: string): Promise<Discount | undefined> {
  if (!hasDatabaseUrl) return undefined;
  const row = await prisma.discountCode.findFirst({
    where: { code: code.trim().toUpperCase(), active: true },
  });
  return row ? { code: row.code, percent_off: row.percentOff, active: row.active ? 1 : 0 } : undefined;
}

export async function upsertDiscount(code: string, percentOff: number, active = true): Promise<void> {
  const normalized = code.trim().toUpperCase();
  await prisma.discountCode.upsert({
    where: { code: normalized },
    create: { code: normalized, percentOff, active },
    update: { percentOff, active },
  });
}

export async function listDiscounts(): Promise<Discount[]> {
  if (!hasDatabaseUrl) return [];
  const rows = await prisma.discountCode.findMany({ orderBy: { code: "asc" } });
  return rows.map((r) => ({ code: r.code, percent_off: r.percentOff, active: r.active ? 1 : 0 }));
}

export async function setDiscountActive(code: string, active: boolean): Promise<void> {
  await prisma.discountCode.update({
    where: { code: code.trim().toUpperCase() },
    data: { active },
  });
}
