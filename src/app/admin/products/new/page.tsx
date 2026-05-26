import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import ProductForm from "@/components/ProductForm";

export const metadata = { title: "New dossier", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/admin" className="text-sm text-stone link-underline">
        ← Back to dashboard
      </Link>
      <h1 className="mt-5 font-display text-3xl">New dossier</h1>
      <p className="mt-2 text-sm text-stone">Create a product and attach the PDF buyers will receive.</p>
      <div className="mt-10">
        <ProductForm />
      </div>
    </section>
  );
}
