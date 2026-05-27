import { cookies } from "next/headers";
import { readToken, ADMIN_COOKIE } from "@/lib/auth";
import { logoutAction } from "./actions";
import { AdminNav } from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const authenticated = readToken(token) === "admin";

  if (!authenticated) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-line bg-paper-dim/60">
        <div className="px-5 py-6">
          <p className="eyebrow">Dreams Happen</p>
          <p className="mt-1 text-xs text-stone">Admin</p>
        </div>
        <AdminNav />
        <div className="border-t border-line px-5 py-4">
          <form action={logoutAction}>
            <button className="text-xs uppercase tracking-wider text-stone hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
