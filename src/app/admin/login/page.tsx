import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loginAction } from "../actions";

export const metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative w-full max-w-md">
        <div className="rounded-lg border border-line/40 bg-glass p-10">
          <p className="eyebrow">Admin &middot; CMS</p>
          <h1 className="mt-4 font-display text-3xl font-bold">Content control</h1>
          <p className="mt-3 text-sm text-stone">
            Sign in to manage dossiers and their PDF distribution.
          </p>

          <form action={loginAction} className="mt-10 space-y-6">
            {error && (
              <p data-testid="login-error" className="rounded border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm text-red-400">
                Incorrect email or password.
              </p>
            )}
            <label className="block text-sm">
              <span className="mb-2 block text-stone">Email</span>
              <input
                name="email"
                type="email"
                required
                data-testid="admin-email"
                className="w-full rounded-md border border-line/40 bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-brass"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-stone">Password</span>
              <input
                name="password"
                type="password"
                required
                data-testid="admin-password"
                className="w-full rounded-md border border-line/40 bg-transparent px-4 py-3 text-ink outline-none transition-colors focus:border-brass"
              />
            </label>
            <button
              type="submit"
              data-testid="admin-login"
              className="btn-primary w-full"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
