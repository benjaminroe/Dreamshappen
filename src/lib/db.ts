import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, "app.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  _db = db;
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id            TEXT PRIMARY KEY,
      slug          TEXT UNIQUE NOT NULL,
      title         TEXT NOT NULL,
      subtitle      TEXT NOT NULL DEFAULT '',
      collection    TEXT NOT NULL DEFAULT 'The Collections',
      description   TEXT NOT NULL DEFAULT '',
      price         INTEGER NOT NULL DEFAULT 0,   -- minor units (fils)
      currency      TEXT NOT NULL DEFAULT 'AED',
      cover_accent  TEXT NOT NULL DEFAULT '#1f2937',
      pages         INTEGER NOT NULL DEFAULT 0,
      pdf_filename  TEXT,                          -- file in /private/pdfs
      published     INTEGER NOT NULL DEFAULT 1,
      sort_order    INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id                TEXT PRIMARY KEY,
      email             TEXT NOT NULL,
      status            TEXT NOT NULL DEFAULT 'pending', -- pending | paid | cancelled
      total             INTEGER NOT NULL DEFAULT 0,
      currency          TEXT NOT NULL DEFAULT 'AED',
      discount_code     TEXT,
      stripe_session_id TEXT,
      created_at        TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id          TEXT PRIMARY KEY,
      order_id    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id  TEXT NOT NULL REFERENCES products(id),
      title       TEXT NOT NULL,
      price       INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS download_grants (
      token          TEXT PRIMARY KEY,
      order_id       TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id     TEXT NOT NULL REFERENCES products(id),
      download_count INTEGER NOT NULL DEFAULT 0,
      created_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      email      TEXT PRIMARY KEY,
      source     TEXT NOT NULL DEFAULT 'footer',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS discount_codes (
      code        TEXT PRIMARY KEY,
      percent_off INTEGER NOT NULL,
      active      INTEGER NOT NULL DEFAULT 1
    );
  `);
}
