import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import ProductForm from "@/components/ProductForm";

export const metadata = { title: "Admin — New dossier", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div className="px-8 py-10 max-w-2xl">
      <Link href="/admin/products" className="text-sm text-stone link-underline">
        ← All products
      </Link>
      <p className="mt-6 eyebrow">Catalog</p>
      <h1 className="mt-2 font-display text-3xl">New dossier</h1>
      <p className="mt-2 text-sm text-stone">Create a product and attach the PDF buyers will receive.</p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
