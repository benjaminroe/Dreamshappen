import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { listProducts } from "@/lib/products";
import { formatMoney } from "@/lib/money";
import { deleteProductAction } from "../actions";

export const metadata = { title: "Admin — Products", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const products = await listProducts({ includeUnpublished: true });

  return (
    <div className="px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-2 font-display text-3xl">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="border border-ink px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper"
        >
          New dossier
        </Link>
      </div>

      <div className="mt-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[0.6rem] uppercase tracking-[0.2em] text-stone">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Collection</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">PDF</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id} className="group">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-7 shrink-0 rounded-sm"
                      style={{ background: `linear-gradient(150deg, ${p.cover_accent}, rgba(0,0,0,0.4))` }}
                    />
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-xs text-stone">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-stone">{p.collection}</td>
                <td className="py-4 tabular-nums">{formatMoney(p.price)}</td>
                <td className="py-4">
                  {p.pdf_filename ? (
                    <span className="rounded bg-brass/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-brass-deep">
                      {p.pdf_filename}
                    </span>
                  ) : (
                    <span className="text-xs text-stone">None</span>
                  )}
                </td>
                <td className="py-4">
                  {p.published ? (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-emerald-800">
                      Published
                    </span>
                  ) : (
                    <span className="rounded bg-stone/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-stone">
                      Draft
                    </span>
                  )}
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-xs uppercase tracking-wider text-ink-soft hover:text-ink"
                    >
                      Edit
                    </Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="text-xs uppercase tracking-wider text-stone hover:text-red-700">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-stone">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="text-brass-deep hover:text-ink">
                    Create one
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
