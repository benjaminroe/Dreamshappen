import { prisma } from "../src/lib/prisma";
import { createProduct, listProducts } from "../src/lib/products";
import { upsertDiscount } from "../src/lib/marketing";
import { seeds, pdfBytesFor } from "./seed-data";

async function run() {
  // SEED_RESET clears existing data first — used by the e2e suite for a
  // deterministic database.
  if (process.env.SEED_RESET === "1") {
    await prisma.downloadGrant.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.subscriber.deleteMany();
    await prisma.discountCode.deleteMany();
    console.log("• reset: cleared existing data");
  }

  const existing = new Set(
    (await listProducts({ includeUnpublished: true })).map((p) => p.slug)
  );

  let idx = 0;
  for (const s of seeds) {
    const pdfData = pdfBytesFor(s);

    if (existing.has(s.slug)) {
      console.log(`• ${s.slug} already exists — skipped`);
      idx++;
      continue;
    }

    await createProduct({
      slug: s.slug,
      title: s.title,
      subtitle: s.subtitle,
      collection: s.collection,
      description: s.description,
      price: s.price,
      cover_accent: s.cover_accent,
      pages: s.pages,
      pdf_filename: `${s.slug}.pdf`,
      pdfData,
      published: 1,
      sort_order: idx,
    });
    console.log(`✓ seeded ${s.slug}`);
    idx++;
  }

  await upsertDiscount("WELCOME10", 10, true);
  console.log("✓ discount code WELCOME10 (10% off) ready");
  console.log("Done.");
}

run()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
