import { execSync } from "node:child_process";

// Seed a deterministic test database. We must NOT delete the db file here:
// Playwright starts the web server before global setup runs, so the server has
// already opened (and created) data/test.db. Deleting it would detach the
// server from the seeded data. Instead we reset and seed the same file, and the
// server sees the changes via SQLite's WAL.
export default async function globalSetup() {
  execSync("npx tsx scripts/seed.ts", {
    stdio: "inherit",
    env: { ...process.env, DB_PATH: "data/test.db", SEED_RESET: "1" },
  });
}
