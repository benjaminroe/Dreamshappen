import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listDiscounts } from "@/lib/marketing";
import { saveDiscountAction, toggleDiscountAction, deleteDiscountAction } from "../actions";

export const metadata = { title: "Admin — Discounts", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DiscountsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const discounts = await listDiscounts();

  return (
    <div className="px-8 py-10 max-w-3xl">
      <p className="eyebrow">Marketing</p>
      <h1 className="mt-2 font-display text-3xl">Discount codes</h1>
      <p className="mt-2 text-sm text-stone">Percentage codes customers can apply at checkout.</p>

      <form action={saveDiscountAction} className="mt-8 rounded border border-line bg-paper-dim/40 p-6">
        <h2 className="font-display text-lg">Create new code</h2>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="text-sm">
            <span className="mb-1 block text-stone">Code</span>
            <input
              name="code"
              required
              placeholder="SUMMER20"
              className="w-44 border border-line bg-paper px-3 py-2 uppercase outline-none focus:border-brass"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-stone">% off</span>
            <input
              name="percent_off"
              type="number"
              min="1"
              max="100"
              required
              defaultValue={10}
              className="w-24 border border-line bg-paper px-3 py-2 outline-none focus:border-brass"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked /> Active
          </label>
          <button className="border border-ink bg-ink px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-transparent hover:text-ink">
            Create
          </button>
        </div>
      </form>

      <div className="mt-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[0.6rem] uppercase tracking-[0.2em] text-stone">
              <th className="pb-3 font-medium">Code</th>
              <th className="pb-3 font-medium">Discount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {discounts.map((d) => (
              <tr key={d.code}>
                <td className="py-3 font-mono">{d.code}</td>
                <td className="py-3">{d.percent_off}% off</td>
                <td className="py-3">
                  {d.active ? (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-emerald-800">
                      Active
                    </span>
                  ) : (
                    <span className="rounded bg-stone/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-stone">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <form action={toggleDiscountAction}>
                      <input type="hidden" name="code" value={d.code} />
                      <input type="hidden" name="active" value={d.active ? "0" : "1"} />
                      <button className="text-xs uppercase tracking-wider text-ink-soft hover:text-ink">
                        {d.active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                    <form action={deleteDiscountAction}>
                      <input type="hidden" name="code" value={d.code} />
                      <button className="text-xs uppercase tracking-wider text-stone hover:text-red-700">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center text-stone">No discount codes yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
