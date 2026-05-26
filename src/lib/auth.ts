import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SECRET = process.env.APP_SECRET || "insecure-dev-secret";
export const ADMIN_COOKIE = "dh_admin";

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

// token = base64url(payload).signature
export function makeToken(payload: string): string {
  const body = Buffer.from(payload).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readToken(token: string | undefined): string | null {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return Buffer.from(body, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL || "admin@dreamshappenltd.com";
  const expectedPassword = process.env.ADMIN_PASSWORD || "changeme";
  return email.trim().toLowerCase() === expectedEmail.toLowerCase() && password === expectedPassword;
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const payload = readToken(token);
  return payload === "admin";
}

export function adminSessionToken(): string {
  return makeToken("admin");
}
