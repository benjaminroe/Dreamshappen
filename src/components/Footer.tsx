import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="relative mt-32">
      <div className="divider-glow" />
      <div className="relative overflow-hidden bg-night/80">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-brass/[0.02] blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <p className="font-display text-2xl font-bold text-ink">Dreams Happen Ltd</p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone">
                Strategic frameworks for the global citizen. Architecture of life, jurisdictional
                thinking, and long-term power.
              </p>
              <p className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brass/70">
                <span className="inline-block h-px w-4 bg-brass/40" />
                Dubai &middot; UAE
              </p>
            </div>

            <div className="text-sm">
              <p className="eyebrow mb-5">Navigate</p>
              <ul className="space-y-3 text-ink-soft">
                <li><Link href="/collections" className="link-underline transition-colors hover:text-brass">The Collections</Link></li>
                <li><Link href="/founder" className="link-underline transition-colors hover:text-brass">The Founder</Link></li>
                <li><Link href="/contact" className="link-underline transition-colors hover:text-brass">Contact</Link></li>
                <li><Link href="/legal/terms" className="link-underline transition-colors hover:text-brass">Terms</Link></li>
                <li><Link href="/legal/privacy" className="link-underline transition-colors hover:text-brass">Privacy</Link></li>
                <li><Link href="/legal/refund" className="link-underline transition-colors hover:text-brass">Refund Policy</Link></li>
              </ul>
            </div>

            <div>
              <p className="eyebrow mb-5">The Dispatch</p>
              <p className="mb-5 text-sm text-stone">
                Occasional notes on jurisdiction, structure, and long-term power.
              </p>
              <NewsletterForm source="footer" />
            </div>
          </div>

          <div className="mt-16 border-t border-line/40 pt-8 flex flex-col items-start justify-between gap-3 text-xs text-stone sm:flex-row">
            <p>&copy; {new Date().getFullYear()} Dreams Happen Ltd. All rights reserved.</p>
            <p className="text-stone/60">Digital products. Instant access. No advisory relationship is created.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
