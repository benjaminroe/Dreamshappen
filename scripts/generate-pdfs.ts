import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { seeds, CONTENT_PDF_DIR, buildPdfFor } from "./seed-data";

// Writes the sample dossier PDFs into content/pdfs/ so they live in the repo.
// `npm run seed` then loads these committed files into the database.
mkdirSync(CONTENT_PDF_DIR, { recursive: true });
for (const s of seeds) {
  const file = path.join(CONTENT_PDF_DIR, `${s.slug}.pdf`);
  writeFileSync(file, buildPdfFor(s));
  console.log(`✓ wrote ${path.relative(process.cwd(), file)}`);
}
console.log("Done.");
