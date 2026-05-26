"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "done">("idle");

  if (status === "done") {
    return (
      <p data-testid="contact-success" className="rounded border border-line bg-paper-dim/60 p-6 text-ink-soft">
        Thank you — your message has been received. We respond to considered enquiries within two
        business days.
      </p>
    );
  }

  return (
    <form
      data-testid="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("done");
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block text-stone">Name</span>
          <input
            required
            name="name"
            className="w-full border-b border-line bg-transparent py-2 outline-none focus:border-brass"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-stone">Email</span>
          <input
            required
            type="email"
            name="email"
            className="w-full border-b border-line bg-transparent py-2 outline-none focus:border-brass"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-2 block text-stone">Message</span>
        <textarea
          required
          name="message"
          rows={5}
          className="w-full border-b border-line bg-transparent py-2 outline-none focus:border-brass"
        />
      </label>
      <button
        type="submit"
        className="border border-ink px-8 py-3 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper"
      >
        Send enquiry
      </button>
    </form>
  );
}
