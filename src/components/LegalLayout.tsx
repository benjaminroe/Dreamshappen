export default function LegalLayout({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <article className="relative mx-auto max-w-3xl px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative">
        <p className="eyebrow flex items-center gap-3">
          <span className="gold-bar" />
          Legal
        </p>
        <h1 className="mt-5 font-display text-5xl font-bold">{title}</h1>
        <p className="mt-3 text-sm text-stone">Last updated {updated}</p>

        <div className="mt-14 space-y-12">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-xl font-bold text-ink">{s.heading}</h2>
              <div className="prose-quiet mt-4">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
