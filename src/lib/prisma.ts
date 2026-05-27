import { PrismaClient } from "@prisma/client";

// A Vercel Postgres store injects DATABASE_URL / DATABASE_URL_UNPOOLED plus the
// POSTGRES_* set, but not DIRECT_URL. Map them to the names the schema expects
// before the client is constructed so deploys work without manual env wiring.
// Guarded assignments: writing undefined to process.env stores the string
// "undefined", so only assign when a real connection string is present.
const dbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING;
if (!process.env.DATABASE_URL && dbUrl) process.env.DATABASE_URL = dbUrl;

const directUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL;
if (!process.env.DIRECT_URL && directUrl) process.env.DIRECT_URL = directUrl;

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
