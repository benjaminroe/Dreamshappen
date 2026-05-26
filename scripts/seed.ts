import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getDb } from "../src/lib/db";
import { createProduct, listProducts } from "../src/lib/products";
import { upsertDiscount } from "../src/lib/marketing";
import { buildPdf } from "../src/lib/pdf";

const PDF_DIR = path.join(process.cwd(), "private", "pdfs");

type Seed = {
  slug: string;
  title: string;
  subtitle: string;
  collection: string;
  price: number; // fils
  pages: number;
  cover_accent: string;
  description: string;
  body: string[];
};

const seeds: Seed[] = [
  {
    slug: "the-jurisdiction-atlas",
    title: "The Jurisdiction Atlas",
    subtitle: "Where the world becomes optional.",
    collection: "The Collections",
    price: 48000,
    pages: 84,
    cover_accent: "#1c3d5a",
    description:
      "A structured map of the jurisdictions that matter — residency, taxation, banking, and mobility — assembled for the citizen who treats geography as a variable, not a fate. We do not offer perspective. We offer the maps; you choose the destination.",
    body: [
      "The Jurisdiction Atlas is a self-directed framework for thinking about where you live, where you bank, and where your decisions are governed.",
      "It treats jurisdiction as architecture: a set of structural choices that compound quietly over decades.",
      "Inside you will find comparative frameworks, decision matrices, and the questions that precede every serious relocation.",
      "This is not advice. It is a map. The destination remains yours.",
    ],
  },
  {
    slug: "architecture-of-life",
    title: "Architecture of Life",
    subtitle: "Designing a life by deliberate structure.",
    collection: "The Collections",
    price: 38000,
    pages: 62,
    cover_accent: "#3a2e4d",
    description:
      "A framework for designing the structure of a life on purpose: time, capital, relationships, and obligations arranged as a system rather than accumulated by accident.",
    body: [
      "Most lives are assembled by default. Architecture of Life proposes the opposite: deliberate structure.",
      "The dossier walks through the load-bearing elements of an intentional life and how they interlock.",
      "You will leave with a structural vocabulary for the decisions that quietly shape everything else.",
    ],
  },
  {
    slug: "long-term-power",
    title: "Long-Term Power",
    subtitle: "Compounding leverage across decades.",
    collection: "The Collections",
    price: 52000,
    pages: 78,
    cover_accent: "#2f4f3e",
    description:
      "Power, properly understood, is patient. This dossier examines the mechanics of leverage that compound across decades rather than quarters.",
    body: [
      "Long-Term Power is about the slow variables — reputation, optionality, ownership, and trust.",
      "It maps how durable advantage is constructed and, more often, how it is accidentally dismantled.",
      "A framework for those who measure in decades.",
    ],
  },
  {
    slug: "the-global-citizen-codex",
    title: "The Global Citizen Codex",
    subtitle: "Residency, mobility, and the borderless mind.",
    collection: "The Collections",
    price: 64000,
    pages: 110,
    cover_accent: "#5a3d2b",
    description:
      "The flagship reference for the internationally-minded: residency pathways, mobility strategy, and the mental models of a life lived across borders.",
    body: [
      "The Global Citizen Codex is the most comprehensive volume in the collection.",
      "It assembles the frameworks of mobility — legal, financial, and psychological — into a single reference.",
      "The borderless mind is a discipline before it is a passport.",
    ],
  },
  {
    slug: "capital-without-borders",
    title: "Capital Without Borders",
    subtitle: "Jurisdictional thinking for your assets.",
    collection: "The Collections",
    price: 56000,
    pages: 96,
    cover_accent: "#1f3a3a",
    description:
      "Apply jurisdictional thinking to capital itself: structure, custody, and the quiet architecture of assets that outlast borders and cycles.",
    body: [
      "Capital Without Borders extends the Atlas from people to capital.",
      "It examines structure, custody, and resilience — the architecture beneath durable wealth.",
      "A framework, not a recommendation.",
    ],
  },
];

function run() {
  const db = getDb();
  mkdirSync(PDF_DIR, { recursive: true });

  // SEED_RESET clears existing data first — used by the e2e suite to get a
  // deterministic database without deleting the file the server has open.
  if (process.env.SEED_RESET === "1") {
    db.exec(
      "DELETE FROM download_grants; DELETE FROM order_items; DELETE FROM orders; DELETE FROM products; DELETE FROM subscribers; DELETE FROM discount_codes;"
    );
    console.log("• reset: cleared existing data");
  }

  const existing = new Set(listProducts({ includeUnpublished: true }).map((p) => p.slug));

  seeds.forEach((s, idx) => {
    const pdfName = `${s.slug}.pdf`;
    writeFileSync(
      path.join(PDF_DIR, pdfName),
      buildPdf(s.title, [s.subtitle, ...s.body, "© Dreams Happen Ltd — Dubai, UAE. Licensed to the purchaser for personal use."])
    );

    if (existing.has(s.slug)) {
      console.log(`• ${s.slug} already exists — skipped (PDF refreshed)`);
      return;
    }

    createProduct({
      slug: s.slug,
      title: s.title,
      subtitle: s.subtitle,
      collection: s.collection,
      description: s.description,
      price: s.price,
      cover_accent: s.cover_accent,
      pages: s.pages,
      pdf_filename: pdfName,
      published: 1,
      sort_order: idx,
    });
    console.log(`✓ seeded ${s.slug}`);
  });

  upsertDiscount("WELCOME10", 10, 1);
  console.log("✓ discount code WELCOME10 (10% off) ready");
  console.log("Done.");
}

run();
