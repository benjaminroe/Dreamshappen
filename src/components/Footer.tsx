import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-line bg-paper-dim/60">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-lg">Dreams Happen Ltd</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone">
              Strategic frameworks for the global citizen. Architecture of life, jurisdictional
              thinking, and long-term power.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone">Dubai · UAE</p>
          </div>

          <div className="text-sm">
            <p className="eyebrow mb-4">Navigate</p>
            <ul className="space-y-2 text-ink-soft">
              <li><Link href="/collections" className="link-underline">The Collections</Link></li>
              <li><Link href="/founder" className="link-underline">The Founder</Link></li>
              <li><Link href="/contact" className="link-underline">Contact</Link></li>
              <li><Link href="/legal/terms" className="link-underline">Terms</Link></li>
              <li><Link href="/legal/privacy" className="link-underline">Privacy</Link></li>
              <li><Link href="/legal/refund" className="link-underline">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">The Dispatch</p>
            <p className="mb-4 text-sm text-stone">
              Occasional notes on jurisdiction, structure, and long-term power.
            </p>
            <NewsletterForm source="footer" />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-2 border-t border-line pt-6 text-xs text-stone sm:flex-row">
          <p>© {new Date().getFullYear()} Dreams Happen Ltd. All rights reserved.</p>
          <p>Digital products. Instant access. No advisory relationship is created.</p>
        </div>
      </div>
    </footer>
  );
}
