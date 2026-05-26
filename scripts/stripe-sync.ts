import Stripe from "stripe";
import { prisma } from "../src/lib/prisma";
import { listProducts, setStripeIds } from "../src/lib/products";

// "Publish to Stripe": create/update a Stripe Product + Price for every
// published dossier and store the IDs back on the catalog. Requires a live
// STRIPE_SECRET_KEY (test or live mode).
async function run() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith("sk_")) {
    console.error("STRIPE_SECRET_KEY is not set. Add it to .env (sk_test_... or sk_live_...).");
    process.exit(1);
  }
  const stripe = new Stripe(key);
  const products = await listProducts({ includeUnpublished: false });
  console.log(`Syncing ${products.length} products to Stripe...`);

  for (const p of products) {
    // Upsert the Stripe Product.
    let stripeProductId = p.stripe_product_id;
    if (stripeProductId) {
      await stripe.products.update(stripeProductId, {
        name: p.title,
        description: p.subtitle || undefined,
        metadata: { slug: p.slug },
      });
    } else {
      const created = await stripe.products.create({
        name: p.title,
        description: p.subtitle || undefined,
        metadata: { slug: p.slug },
      });
      stripeProductId = created.id;
    }

    // Create a Price if the amount changed or none exists yet.
    let stripePriceId = p.stripe_price_id;
    const needsPrice =
      !stripePriceId ||
      (await stripe.prices.retrieve(stripePriceId).then((pr) => pr.unit_amount !== p.price).catch(() => true));
    if (needsPrice) {
      const price = await stripe.prices.create({
        product: stripeProductId,
        currency: "aed",
        unit_amount: p.price,
      });
      stripePriceId = price.id;
    }

    await setStripeIds(p.id, stripeProductId, stripePriceId!);
    console.log(`✓ ${p.slug} → ${stripeProductId} / ${stripePriceId}`);
  }
  console.log("Stripe sync complete.");
}

run()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
