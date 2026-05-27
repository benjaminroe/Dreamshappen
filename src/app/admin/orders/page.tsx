import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { listAllOrders } from "@/lib/metrics";
import { formatMoney } from "@/lib/money";

export const metadata = { title: "Admin — Orders", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const orders = await listAllOrders();

  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.status === "paid").length,
    pending: orders.filter((o) => o.status === "pending").length,
    revenue: orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="px-8 py-10">
      <p className="eyebrow">Management</p>
      <h1 className="mt-2 font-display text-3xl">Orders</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <MiniStat label="Total" value={String(stats.total)} />
        <MiniStat label="Paid" value={String(stats.paid)} />
        <MiniStat label="Pending" value={String(stats.pending)} />
        <MiniStat label="Revenue" value={formatMoney(stats.revenue)} />
      </div>

      <div className="mt-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[0.6rem] uppercase tracking-[0.2em] text-stone">
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Items</th>
              <th className="pb-3 font-medium text-right">Total</th>
              <th className="pb-3 font-medium text-right">Date</th>
              <th className="pb-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((o) => (
              <tr key={o.id} className="group">
                <td className="py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="py-3">
                  <p className="truncate max-w-[200px]">{o.email}</p>
                </td>
                <td className="py-3 text-stone">
                  {o.items.map((i) => i.product.title).join(", ")}
                </td>
                <td className="py-3 text-right tabular-nums font-medium">
                  {formatMoney(o.total)}
                </td>
                <td className="py-3 text-right text-stone">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="invisible text-xs uppercase tracking-wider text-brass-deep hover:text-ink group-hover:visible"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-stone">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line p-4">
      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">{label}</p>
      <p className="mt-1 font-display text-xl tabular-nums">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[0.6rem] uppercase tracking-wider font-medium ${colors[status] || "bg-stone/10 text-stone"}`}>
      {status}
    </span>
  );
}
