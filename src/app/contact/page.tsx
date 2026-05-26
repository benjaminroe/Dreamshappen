import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Dreams Happen Ltd — Dubai, UAE.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-5 font-display text-4xl md:text-5xl">Begin a conversation</h1>
          <p className="mt-6 leading-relaxed text-ink-soft">
            For questions about the collections, licensing, or your purchase, write to us. We are a
            digital publisher — there is no physical office, and no advisory relationship is created.
          </p>
          <div className="mt-10 space-y-4 text-sm">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">Email</p>
              <p className="mt-1 text-ink">hello@dreamshappenltd.com</p>
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">Registered</p>
              <p className="mt-1 text-ink">Dubai, United Arab Emirates</p>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
