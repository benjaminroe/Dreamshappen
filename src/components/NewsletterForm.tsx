"use client";

import { useState } from "react";

export default function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("done");
      setMessage(data.message || "You are on the list.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return (
      <p data-testid="newsletter-success" className="text-sm text-brass-deep">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-3 sm:flex-row" noValidate>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        data-testid="newsletter-email"
        className="flex-1 border-b border-line bg-transparent px-1 py-2 text-sm outline-none placeholder:text-stone/60 focus:border-brass"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        data-testid="newsletter-submit"
        className="whitespace-nowrap border border-ink px-5 py-2 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper disabled:opacity-50"
      >
        {status === "loading" ? "…" : "Subscribe"}
      </button>
      {status === "error" && (
        <span className="text-xs text-red-700 sm:hidden">{message}</span>
      )}
    </form>
  );
}
