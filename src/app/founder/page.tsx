import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Founder",
  description:
    "Priscila founded Dreams Happen Ltd to publish proprietary frameworks on global strategy and the architecture of life.",
};

export default function FounderPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <p className="eyebrow">The Founder</p>
      <h1 className="mt-5 font-display text-4xl md:text-5xl">Priscila</h1>

      <div className="mt-10 aspect-[16/7] w-full bg-gradient-to-br from-ink via-ink-soft to-stone" />

      <div className="prose-quiet mt-12 text-lg">
        <p>
          Dreams Happen Ltd was founded on a single conviction: that a life, like a strategy, can be
          designed rather than inherited. Priscila built the collection to make her proprietary
          frameworks — on jurisdiction, structure, and long-term power — available to the
          internationally-minded reader.
        </p>
        <p>
          The work draws on years spent studying how mobile, autonomous lives are actually
          constructed: the legal architecture, the financial structure, and the mental models that
          precede every deliberate move across borders.
        </p>
        <p>
          “We do not offer perspective,” she writes. “We offer the maps; you choose the destination.”
          The dossiers are self-directed by design. There is no advisory relationship, no ongoing
          obligation — only the frameworks, and the reader’s own judgement.
        </p>
        <p>
          Registered in Dubai and published entirely in digital form, Dreams Happen Ltd serves a
          single kind of reader: the one who treats geography, capital, and time as variables to be
          arranged on purpose.
        </p>
      </div>

      <div className="mt-12 border-t border-line pt-10">
        <Link
          href="/collections"
          className="border border-ink px-8 py-3 text-xs uppercase tracking-[0.22em] transition hover:bg-ink hover:text-paper"
        >
          Explore the Collections
        </Link>
      </div>
    </article>
  );
}
