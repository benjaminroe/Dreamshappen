import { execSync } from "node:child_process";

// Runs `prisma migrate deploy` only when a database is configured. This lets a
// first Vercel deploy succeed before any env vars are set, while automatically
// applying migrations on later deploys once DATABASE_URL is added.
if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL not set — skipping prisma migrate deploy.");
  process.exit(0);
}

try {
  execSync("prisma migrate deploy", { stdio: "inherit" });
} catch (err) {
  console.error("prisma migrate deploy failed:", err instanceof Error ? err.message : err);
  process.exit(1);
}
