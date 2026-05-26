import { execSync } from "node:child_process";

// Prepare the Postgres test database BEFORE Playwright starts the web server.
// (The web server queries the DB on its first request, so the schema and seed
// data must already exist or the readiness check deadlocks.)
const url =
  process.env.TEST_DATABASE_URL ||
  "postgresql://dh:dh@localhost:5432/dreamshappen_test?schema=public";
const env = { ...process.env, DATABASE_URL: url, DIRECT_URL: url };

execSync("npx prisma migrate deploy", { stdio: "inherit", env });
execSync("npx tsx scripts/seed.ts", { stdio: "inherit", env: { ...env, SEED_RESET: "1" } });
