import { getDb } from "./db";

// --- Marketing: newsletter / lead capture -------------------------------
export function addSubscriber(email: string, source = "footer"): boolean {
  const normalized = email.trim().toLowerCase();
  const result = getDb()
    .prepare("INSERT OR IGNORE INTO subscribers (email, source) VALUES (?, ?)")
    .run(normalized, source);
  return result.changes > 0;
}

export function listSubscribers(): { email: string; source: string; created_at: string }[] {
  return getDb()
    .prepare("SELECT email, source, created_at FROM subscribers ORDER BY created_at DESC")
    .all() as { email: string; source: string; created_at: string }[];
}

// --- Sales: discount codes ----------------------------------------------
export type Discount = { code: string; percent_off: number; active: number };

export function lookupDiscount(code: string): Discount | undefined {
  const row = getDb()
    .prepare("SELECT * FROM discount_codes WHERE code = ? AND active = 1")
    .get(code.trim().toUpperCase()) as Discount | undefined;
  return row;
}

export function upsertDiscount(code: string, percentOff: number, active = 1): void {
  getDb()
    .prepare(
      `INSERT INTO discount_codes (code, percent_off, active) VALUES (?, ?, ?)
       ON CONFLICT(code) DO UPDATE SET percent_off = excluded.percent_off, active = excluded.active`
    )
    .run(code.trim().toUpperCase(), percentOff, active);
}
