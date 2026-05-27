import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Founder",
  description:
    "Priscila founded Dreams Happen Ltd to publish proprietary frameworks on global strategy and the architecture of life.",
};

export default function FounderPage() {
  return (
    <article className="relative">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />

      <div className="relative mx-auto max-w-3xl px-6 py-24 md:py-32">
        <p className="fade-up eyebrow flex items-center gap-3">
          <span className="gold-bar" />
          The Founder
        </p>
        <h1 className="mask-reveal mt-6 font-display text-6xl font-extrabold md:text-7xl lg:text-8xl">
          <span className="gradient-text">Priscila</span>
        </h1>

        <div className="fade-up fade-up-delay-2 mt-12 aspect-[16/7] w-full overflow-hidden rounded-lg">
          <div className="h-full w-full bg-gradient-to-br from-brass/30 via-paper-dim to-night" />
        </div>

        <div className="prose-quiet mt-14 text-lg">
          <p className="reveal">
            Dreams Happen Ltd was founded on a single conviction: that a life, like a strategy, can be
            designed rather than inherited. Priscila built the collection to make her proprietary
            frameworks — on jurisdiction, structure, and long-term power — available to the
            internationally-minded reader.
          </p>
          <p className="reveal">
            The work draws on years spent studying how mobile, autonomous lives are actually
            constructed: the legal architecture, the financial structure, and the mental models that
            precede every deliberate move across borders.
          </p>
          <p className="reveal">
            &ldquo;We do not offer perspective,&rdquo; she writes. &ldquo;We offer the maps;{" "}
            <span className="text-brass">you choose the destination.</span>&rdquo;
            The dossiers are self-directed by design. There is no advisory relationship, no ongoing
            obligation — only the frameworks, and the reader&rsquo;s own judgement.
          </p>
          <p className="reveal">
            Registered in Dubai and published entirely in digital form, Dreams Happen Ltd serves a
            single kind of reader: the one who treats geography, capital, and time as variables to be
            arranged on purpose.
          </p>
        </div>

        <div className="reveal mt-14">
          <div className="divider-glow mb-12" />
          <Link href="/collections" className="btn-primary">
            Explore the Collections
          </Link>
        </div>
      </div>
    </article>
  );
}
