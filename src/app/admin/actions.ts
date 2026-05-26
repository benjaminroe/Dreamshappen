"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  verifyAdminCredentials,
  adminSessionToken,
  ADMIN_COOKIE,
  isAdmin,
} from "@/lib/auth";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  type ProductInput,
} from "@/lib/products";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (!verifyAdminCredentials(email, password)) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, adminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function readUploadedPdf(file: File | null): Promise<Buffer | null> {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) return null;
  return Buffer.from(await file.arrayBuffer());
}

export async function saveProductAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");

  const id = (formData.get("id") as string) || "";
  const title = String(formData.get("title") || "").trim();
  const slug = slugify(String(formData.get("slug") || title));
  const priceMajor = parseFloat(String(formData.get("price") || "0"));
  const existing = id ? await getProductById(id) : undefined;

  const pdfData = await readUploadedPdf(formData.get("pdf") as File | null);

  const input: ProductInput = {
    slug,
    title,
    subtitle: String(formData.get("subtitle") || "").trim(),
    collection: String(formData.get("collection") || "The Collections").trim(),
    description: String(formData.get("description") || "").trim(),
    price: Math.max(0, Math.round((isNaN(priceMajor) ? 0 : priceMajor) * 100)),
    cover_accent: String(formData.get("cover_accent") || "#1f2937"),
    pages: parseInt(String(formData.get("pages") || "0"), 10) || 0,
    pdf_filename: pdfData ? `${slug}.pdf` : existing?.pdf_filename ?? null,
    pdfData,
    published: formData.get("published") ? 1 : 0,
    sort_order: parseInt(String(formData.get("sort_order") || "0"), 10) || 0,
  };

  if (id && existing) {
    await updateProduct(id, input);
  } else {
    await createProduct(input);
  }

  revalidatePath("/collections");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteProductAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = String(formData.get("id") || "");
  if (id) await deleteProduct(id);
  revalidatePath("/collections");
  redirect("/admin");
}
