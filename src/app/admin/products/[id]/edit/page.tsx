import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import ProductForm from "@/components/ProductForm";

export const metadata = { title: "Edit dossier", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/admin" className="text-sm text-stone link-underline">
        ← Back to dashboard
      </Link>
      <h1 className="mt-5 font-display text-3xl">Edit · {product.title}</h1>
      <div className="mt-10">
        <ProductForm product={product} />
      </div>
    </section>
  );
}
