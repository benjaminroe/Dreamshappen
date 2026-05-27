import { PrismaClient } from "@prisma/client";

// Map every known Vercel/Neon Postgres env-var shape to what Prisma expects:
//   DATABASE_URL  → pooled connection (runtime queries)
//   DIRECT_URL    → direct/unpooled connection (migrations)
//
// Neon via Vercel Marketplace injects (with the user's chosen prefix, e.g. POSTGRES_):
//   POSTGRES_PRISMA_URL, POSTGRES_URL, POSTGRES_DATABASE_URL,
//   POSTGRES_URL_NON_POOLING, POSTGRES_DATABASE_URL_UNPOOLED
//
// The old Vercel Postgres product injected:
//   POSTGRES_PRISMA_URL, POSTGRES_URL, DATABASE_URL_UNPOOLED,
//   POSTGRES_URL_NON_POOLING

const pooled =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL;

const unpooled =
  process.env.POSTGRES_DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  pooled;

if (!process.env.DATABASE_URL && pooled) process.env.DATABASE_URL = pooled;
if (!process.env.DIRECT_URL && unpooled) process.env.DIRECT_URL = unpooled;

/** True when a DATABASE_URL is present (from env or mapped Vercel vars). */
export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  (hasDatabaseUrl
    ? new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      })
    : (null as unknown as PrismaClient));

if (process.env.NODE_ENV !== "production" && hasDatabaseUrl) globalForPrisma.prisma = prisma;
