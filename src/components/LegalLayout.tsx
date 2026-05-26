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
    <article className="mx-auto max-w-3xl px-6 py-20">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-5 font-display text-4xl">{title}</h1>
      <p className="mt-3 text-sm text-stone">Last updated {updated}</p>

      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl">{s.heading}</h2>
            <div className="prose-quiet mt-3">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
