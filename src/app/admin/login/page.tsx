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
    <section className="mx-auto max-w-md px-6 py-28">
      <p className="eyebrow">Admin · CMS</p>
      <h1 className="mt-4 font-display text-3xl">Content control</h1>
      <p className="mt-3 text-sm text-stone">
        Sign in to manage dossiers and their PDF distribution.
      </p>

      <form action={loginAction} className="mt-10 space-y-5">
        {error && (
          <p data-testid="login-error" className="text-sm text-red-700">
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
            className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-brass"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-stone">Password</span>
          <input
            name="password"
            type="password"
            required
            data-testid="admin-password"
            className="w-full border border-line bg-paper px-3 py-2 outline-none focus:border-brass"
          />
        </label>
        <button
          type="submit"
          data-testid="admin-login"
          className="w-full border border-ink bg-ink py-3 text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-transparent hover:text-ink"
        >
          Sign in
        </button>
      </form>
    </section>
  );
}
