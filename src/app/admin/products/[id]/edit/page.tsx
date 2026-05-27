import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import ProductForm from "@/components/ProductForm";

export const metadata = { title: "Admin — Edit dossier", robots: { index: false } };
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
    <div className="px-8 py-10 max-w-2xl">
      <Link href="/admin/products" className="text-sm text-stone link-underline">
        ← All products
      </Link>
      <p className="mt-6 eyebrow">Catalog</p>
      <h1 className="mt-2 font-display text-3xl">Edit · {product.title}</h1>
      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
