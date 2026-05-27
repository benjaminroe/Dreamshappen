import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Dreams Happen Ltd — Dubai, UAE.",
};

export default function ContactPage() {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="grid gap-14 md:grid-cols-2">
          <div className="fade-up">
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-bar" />
              Contact
            </p>
            <h1 className="mask-reveal mt-6 font-display text-5xl font-extrabold md:text-6xl">
              <span className="gradient-text">Begin a conversation</span>
            </h1>
            <p className="mt-6 leading-relaxed text-ink-soft">
              For questions about the collections, licensing, or your purchase, write to us. We are a
              digital publisher — there is no physical office, and no advisory relationship is created.
            </p>
            <div className="mt-10 space-y-5 text-sm">
              <div className="rounded-lg border border-line/40 bg-glass p-5">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">Email</p>
                <p className="mt-1.5 text-ink">hello@dreamshappenltd.com</p>
              </div>
              <div className="rounded-lg border border-line/40 bg-glass p-5">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone">Registered</p>
                <p className="mt-1.5 text-ink">Dubai, United Arab Emirates</p>
              </div>
            </div>
          </div>
          <div className="fade-up fade-up-delay-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
