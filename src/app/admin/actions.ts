"use server";

import { cookies, headers } from "next/headers";
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
import { upsertDiscount, setDiscountActive, listSubscribers } from "@/lib/marketing";
import { markOrderPaid, markOrderEmailed, getOrder, getGrantsForOrder, productForGrant } from "@/lib/orders";
import { sendOrderConfirmation } from "@/lib/email";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";

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
  revalidatePath("/admin");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = String(formData.get("id") || "");
  if (id) await deleteProduct(id);
  revalidatePath("/collections");
  revalidatePath("/admin");
  redirect("/admin/products");
}

export async function saveDiscountAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const code = String(formData.get("code") || "").trim();
  const percent = parseInt(String(formData.get("percent_off") || "0"), 10);
  if (code && percent > 0 && percent <= 100) {
    await upsertDiscount(code, percent, formData.get("active") ? true : false);
  }
  revalidatePath("/admin/discounts");
  redirect("/admin/discounts");
}

export async function toggleDiscountAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const code = String(formData.get("code") || "");
  const active = String(formData.get("active") || "") === "1";
  if (code) await setDiscountActive(code, active);
  revalidatePath("/admin/discounts");
  redirect("/admin/discounts");
}

export async function deleteDiscountAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const code = String(formData.get("code") || "").trim().toUpperCase();
  if (code) {
    await prisma.discountCode.delete({ where: { code } });
  }
  revalidatePath("/admin/discounts");
  redirect("/admin/discounts");
}

export async function markPaidAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin/orders");

  const grants = await markOrderPaid(id);
  const order = await getOrder(id);

  if (order && order.status === "paid" && !order.emailed_at) {
    const h = await headers();
    const proto = h.get("x-forwarded-proto") || "https";
    const host = h.get("host") || "localhost:3000";
    const siteUrl = `${proto}://${host}`;

    const links: { title: string; url: string }[] = [];
    for (const grant of grants) {
      const product = await productForGrant(grant);
      if (product) links.push({ title: product.title, url: `${siteUrl}/api/download/${grant.token}` });
    }

    await markOrderEmailed(id);
    await sendOrderConfirmation({
      to: order.email,
      orderId: order.id,
      total: formatMoney(order.total, order.currency),
      links,
    });
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect(`/admin/orders/${id}`);
}

export async function cancelOrderAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = String(formData.get("id") || "");
  if (id) {
    await prisma.order.update({ where: { id }, data: { status: "cancelled" } });
  }
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect(`/admin/orders/${id}`);
}

export async function resendEmailAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin/orders");

  const order = await getOrder(id);
  if (!order || order.status !== "paid") redirect(`/admin/orders/${id}`);

  const grants = await getGrantsForOrder(id);
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("host") || "localhost:3000";
  const siteUrl = `${proto}://${host}`;

  const links: { title: string; url: string }[] = [];
  for (const grant of grants) {
    const product = await productForGrant(grant);
    if (product) links.push({ title: product.title, url: `${siteUrl}/api/download/${grant.token}` });
  }

  await sendOrderConfirmation({
    to: order.email,
    orderId: order.id,
    total: formatMoney(order.total, order.currency),
    links,
  });

  revalidatePath(`/admin/orders/${id}`);
  redirect(`/admin/orders/${id}`);
}

export async function exportSubscribersAction() {
  if (!(await isAdmin())) redirect("/admin/login");
  const subscribers = await listSubscribers();
  const csv = ["email,source,subscribed_at", ...subscribers.map((s) => `${s.email},${s.source},${s.created_at}`)].join("\n");
  const encoded = Buffer.from(csv).toString("base64");
  redirect(`/api/admin/export-subscribers?data=${encoded}`);
}
