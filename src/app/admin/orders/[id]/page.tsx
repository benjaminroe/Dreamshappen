import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getOrderDetail } from "@/lib/metrics";
import { formatMoney } from "@/lib/money";
import { markPaidAction, cancelOrderAction, resendEmailAction } from "../../actions";

export const metadata = { title: "Admin — Order detail", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const order = await getOrderDetail(id);
  if (!order) notFound();

  return (
    <div className="px-8 py-10 max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-stone link-underline">
        ← All orders
      </Link>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <p className="eyebrow">Order</p>
          <h1 className="mt-2 font-display text-2xl">{order.email}</h1>
          <p className="mt-1 text-sm text-stone">
            {new Date(order.createdAt).toLocaleString()} · {order.id.slice(0, 8)}…
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        {order.status === "pending" && (
          <form action={markPaidAction}>
            <input type="hidden" name="id" value={order.id} />
            <button className="border border-emerald-700 bg-emerald-700 px-4 py-2 text-xs uppercase tracking-wider text-white transition hover:bg-emerald-800">
              Mark paid
            </button>
          </form>
        )}
        {order.status === "pending" && (
          <form action={cancelOrderAction}>
            <input type="hidden" name="id" value={order.id} />
            <button className="border border-red-600 px-4 py-2 text-xs uppercase tracking-wider text-red-600 transition hover:bg-red-600 hover:text-white">
              Cancel
            </button>
          </form>
        )}
        {order.status === "paid" && (
          <form action={resendEmailAction}>
            <input type="hidden" name="id" value={order.id} />
            <button className="border border-ink px-4 py-2 text-xs uppercase tracking-wider transition hover:bg-ink hover:text-paper">
              Resend confirmation
            </button>
          </form>
        )}
      </div>

      {/* Order info */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <InfoBlock label="Total" value={formatMoney(order.total)} />
        <InfoBlock label="Currency" value={order.currency} />
        <InfoBlock label="Discount" value={order.discountCode || "—"} />
        <InfoBlock label="Stripe session" value={order.stripeSessionId?.slice(0, 20) || "Simulated"} />
        <InfoBlock label="Email sent" value={order.emailedAt ? new Date(order.emailedAt).toLocaleString() : "Not yet"} />
      </div>

      {/* Line items */}
      <h2 className="mt-10 font-display text-xl">Items</h2>
      <div className="mt-4 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-medium">{item.product.title}</p>
              <p className="text-xs text-stone">{item.product.slug}</p>
            </div>
            <p className="text-sm tabular-nums">{formatMoney(item.price)}</p>
            {item.product.pdfFilename && (
              <span className="rounded bg-brass/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-brass-deep">
                PDF
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Download grants */}
      {order.grants.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-xl">Download links</h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {order.grants.map((g) => {
              const item = order.items.find((i) => i.productId === g.productId);
              return (
                <div key={g.token} className="flex items-center gap-4 py-3">
                  <div className="flex-1">
                    <p className="text-sm">{item?.product.title || g.productId}</p>
                    <p className="font-mono text-xs text-stone truncate max-w-[300px]">{g.token}</p>
                  </div>
                  <p className="text-xs text-stone">{g.downloadCount} download{g.downloadCount !== 1 ? "s" : ""}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
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
    <span className={`inline-block rounded px-2.5 py-1 text-xs uppercase tracking-wider font-medium ${colors[status] || "bg-stone/10 text-stone"}`}>
      {status}
    </span>
  );
}
