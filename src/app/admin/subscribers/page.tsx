import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listSubscribers } from "@/lib/marketing";
import { exportSubscribersAction } from "../actions";

export const metadata = { title: "Admin — Subscribers", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const subscribers = await listSubscribers();

  const bySource = subscribers.reduce<Record<string, number>>((acc, s) => {
    acc[s.source] = (acc[s.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Audience</p>
          <h1 className="mt-2 font-display text-3xl">Subscribers</h1>
        </div>
        <form action={exportSubscribersAction}>
          <button className="border border-ink px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper">
            Export CSV
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="border border-line p-4">
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">Total</p>
          <p className="mt-1 font-display text-xl tabular-nums">{subscribers.length}</p>
        </div>
        {Object.entries(bySource).map(([source, count]) => (
          <div key={source} className="border border-line p-4">
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">From: {source}</p>
            <p className="mt-1 font-display text-xl tabular-nums">{count}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[0.6rem] uppercase tracking-[0.2em] text-stone">
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Source</th>
              <th className="pb-3 font-medium text-right">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {subscribers.map((s) => (
              <tr key={s.email}>
                <td className="py-3">{s.email}</td>
                <td className="py-3 text-stone">{s.source}</td>
                <td className="py-3 text-right text-stone">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={3} className="py-10 text-center text-stone">No subscribers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
