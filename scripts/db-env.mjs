// Maps the Postgres connection vars that Vercel/Neon inject to the names this
// project's Prisma schema expects (DATABASE_URL + DIRECT_URL). A Vercel Postgres
// store provides DATABASE_URL / DATABASE_URL_UNPOOLED plus the POSTGRES_* set,
// but not DIRECT_URL — without this, `prisma migrate deploy` fails at build.
//
// Assignments are guarded: writing `undefined` to process.env coerces to the
// string "undefined" (truthy), which would defeat the "no database configured"
// check, so only assign when a real connection string is available.
export function normalizeDbEnv() {
  const e = process.env;

  if (!e.DATABASE_URL) {
    const url =
      e.POSTGRES_PRISMA_URL ||
      e.POSTGRES_URL ||
      e.DATABASE_URL_UNPOOLED ||
      e.POSTGRES_URL_NON_POOLING;
    if (url) e.DATABASE_URL = url;
  }

  if (!e.DIRECT_URL) {
    const url =
      e.DATABASE_URL_UNPOOLED ||
      e.POSTGRES_URL_NON_POOLING ||
      e.DATABASE_URL;
    if (url) e.DIRECT_URL = url;
  }
}
