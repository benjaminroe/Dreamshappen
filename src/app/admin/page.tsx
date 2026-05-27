import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/metrics";
import { formatMoney } from "@/lib/money";

export const metadata = { title: "Admin — Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/login");
  const m = await getDashboardMetrics();

  return (
    <div className="px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="mt-2 font-display text-3xl">Dashboard</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="border border-ink px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper"
        >
          New dossier
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Revenue" value={formatMoney(m.totalRevenue)} />
        <Stat label="Paid orders" value={String(m.paidOrders)} />
        <Stat label="Pending" value={String(m.pendingOrders)} highlight={m.pendingOrders > 0} />
        <Stat label="Downloads" value={String(m.totalDownloads)} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products" value={`${m.publishedCount} / ${m.productCount}`} />
        <Stat label="Subscribers" value={String(m.subscriberCount)} />
        <Stat label="Conversion" value={m.orderCount > 0 ? `${Math.round((m.paidOrders / m.orderCount) * 100)}%` : "—"} />
        <Stat label="Avg order" value={m.paidOrders > 0 ? formatMoney(Math.round(m.totalRevenue / m.paidOrders)) : "—"} />
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs uppercase tracking-wider text-brass-deep hover:text-ink">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {m.recentOrders.length === 0 && <p className="py-6 text-sm text-stone">No orders yet.</p>}
            {m.recentOrders.map((o) => (
              <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center gap-3 py-3 transition hover:bg-paper-dim/50">
                <StatusBadge status={o.status} />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm">{o.email}</p>
                  <p className="text-xs text-stone">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-medium tabular-nums">{formatMoney(o.total)}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div>
          <h2 className="font-display text-xl">Top products</h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {m.topProducts.length === 0 && <p className="py-6 text-sm text-stone">No sales data yet.</p>}
            {m.topProducts.map((p) => (
              <div key={p.title} className="flex items-center gap-3 py-3">
                <div className="flex-1">
                  <p className="text-sm">{p.title}</p>
                  <p className="text-xs text-stone">{p.orders} order{p.orders !== 1 ? "s" : ""}</p>
                </div>
                <p className="text-sm font-medium tabular-nums">{formatMoney(p.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue over time */}
      {m.ordersOverTime.length > 1 && (
        <div className="mt-12">
          <h2 className="font-display text-xl">Revenue (last 30 days)</h2>
          <div className="mt-4 flex items-end gap-1 h-32 border-b border-line">
            {m.ordersOverTime.map((d) => {
              const max = Math.max(...m.ordersOverTime.map((x) => x.revenue));
              const height = max > 0 ? (d.revenue / max) * 100 : 0;
              return (
                <div
                  key={d.date}
                  className="flex-1 bg-brass/60 rounded-t transition-all hover:bg-brass"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${d.date}: ${formatMoney(d.revenue)} (${d.count} orders)`}
                />
              );
            })}
          </div>
          <div className="mt-1 flex justify-between text-[0.6rem] text-stone">
            <span>{m.ordersOverTime[0]?.date}</span>
            <span>{m.ordersOverTime[m.ordersOverTime.length - 1]?.date}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="border border-line bg-paper-dim/40 p-5">
      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">{label}</p>
      <p className={`mt-1 font-display text-2xl tabular-nums ${highlight ? "text-brass-deep" : ""}`}>{value}</p>
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
