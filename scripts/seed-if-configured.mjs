import { execSync } from "node:child_process";
import { normalizeDbEnv } from "./db-env.mjs";

// Seeds demo content during a deploy, but only when a database is configured
// and only if it is empty (SEED_IF_EMPTY). A missing database simply skips, so
// the first import builds before a Postgres store is attached. Seeding never
// fails the build — a populated store is nice-to-have, not load-bearing.
normalizeDbEnv();

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL not set — skipping seed.");
  process.exit(0);
}

try {
  execSync("tsx scripts/seed.ts", {
    stdio: "inherit",
    env: { ...process.env, SEED_IF_EMPTY: "1" },
  });
} catch (err) {
  console.error("seed skipped (non-fatal):", err instanceof Error ? err.message : err);
  process.exit(0);
}
