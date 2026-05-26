import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { listProducts } from "@/lib/products";
import { listSubscribers, listDiscounts } from "@/lib/marketing";
import { formatMoney } from "@/lib/money";
import { logoutAction, deleteProductAction, saveDiscountAction, toggleDiscountAction } from "./actions";

export const metadata = { title: "Admin dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/login");

  const products = await listProducts({ includeUnpublished: true });
  const subscribers = await listSubscribers();
  const discounts = await listDiscounts();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Admin · CMS</p>
          <h1 className="mt-3 font-display text-3xl">Content control</h1>
        </div>
        <form action={logoutAction}>
          <button className="text-xs uppercase tracking-wider text-stone hover:text-ink">Sign out</button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Dossiers" value={String(products.length)} />
        <Stat label="Published" value={String(products.filter((p) => p.published).length)} />
        <Stat label="Subscribers" value={String(subscribers.length)} />
      </div>

      <div className="mt-12 flex items-center justify-between">
        <h2 className="font-display text-2xl">Dossiers</h2>
        <Link
          href="/admin/products/new"
          data-testid="new-product"
          className="border border-ink px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper"
        >
          New dossier
        </Link>
      </div>

      <div className="mt-6 divide-y divide-line border-y border-line" data-testid="admin-product-list">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 py-4">
            <div
              className="h-12 w-9 shrink-0"
              style={{ background: `linear-gradient(150deg, ${p.cover_accent}, rgba(0,0,0,0.4))` }}
            />
            <div className="flex-1">
              <p className="font-display text-lg">{p.title}</p>
              <p className="text-xs text-stone">
                {p.slug} · {formatMoney(p.price)} ·{" "}
                {p.pdf_filename ? "PDF attached" : "no PDF"} ·{" "}
                {p.published ? "published" : "draft"}
              </p>
            </div>
            <Link href={`/admin/products/${p.id}/edit`} className="text-xs uppercase tracking-wider text-ink-soft hover:text-ink">
              Edit
            </Link>
            <form action={deleteProductAction}>
              <input type="hidden" name="id" value={p.id} />
              <button className="text-xs uppercase tracking-wider text-stone hover:text-red-700">Delete</button>
            </form>
          </div>
        ))}
        {products.length === 0 && <p className="py-6 text-stone">No dossiers yet.</p>}
      </div>

      {/* Marketing & sales: discount codes */}
      <h2 className="mt-16 font-display text-2xl">Discount codes</h2>
      <p className="mt-2 text-sm text-stone">Percentage codes customers can apply at checkout.</p>

      <form action={saveDiscountAction} className="mt-6 flex flex-wrap items-end gap-3" data-testid="discount-form">
        <label className="text-sm">
          <span className="mb-1 block text-stone">Code</span>
          <input name="code" required placeholder="SUMMER20" data-testid="discount-code"
            className="w-40 border border-line bg-paper px-3 py-2 uppercase outline-none focus:border-brass" />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-stone">% off</span>
          <input name="percent_off" type="number" min="1" max="100" required defaultValue={10} data-testid="discount-percent"
            className="w-24 border border-line bg-paper px-3 py-2 outline-none focus:border-brass" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked /> Active
        </label>
        <button data-testid="discount-save"
          className="border border-ink bg-ink px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-transparent hover:text-ink">
          Save code
        </button>
      </form>

      <div className="mt-6 divide-y divide-line border-y border-line" data-testid="discount-list">
        {discounts.map((d) => (
          <div key={d.code} className="flex items-center gap-4 py-3 text-sm">
            <span className="font-mono tabular-nums">{d.code}</span>
            <span className="text-stone">{d.percent_off}% off</span>
            <span className={d.active ? "text-brass-deep" : "text-stone"}>
              {d.active ? "active" : "inactive"}
            </span>
            <form action={toggleDiscountAction} className="ml-auto">
              <input type="hidden" name="code" value={d.code} />
              <input type="hidden" name="active" value={d.active ? "0" : "1"} />
              <button className="text-xs uppercase tracking-wider text-ink-soft hover:text-ink">
                {d.active ? "Deactivate" : "Activate"}
              </button>
            </form>
          </div>
        ))}
        {discounts.length === 0 && <p className="py-4 text-stone">No discount codes yet.</p>}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-paper-dim/40 p-5">
      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">{label}</p>
      <p className="mt-1 font-display text-2xl tabular-nums">{value}</p>
    </div>
  );
}
