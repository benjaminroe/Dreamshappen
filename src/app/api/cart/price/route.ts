import { NextResponse } from "next/server";
import { z } from "zod";
import { priceCart } from "@/lib/orders";
import { formatMoney } from "@/lib/money";

const schema = z.object({
  slugs: z.array(z.string()).default([]),
  code: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { slugs, code } = parsed.data;
  const cart = priceCart(
    slugs.map((slug) => ({ slug, quantity: 1 })),
    code ?? null
  );

  return NextResponse.json({
    items: cart.items.map((i) => ({
      slug: i.product.slug,
      title: i.product.title,
      subtitle: i.product.subtitle,
      price: i.price,
      priceLabel: formatMoney(i.price, i.product.currency),
      cover_accent: i.product.cover_accent,
      pages: i.product.pages,
    })),
    subtotal: cart.subtotal,
    subtotalLabel: formatMoney(cart.subtotal),
    discountCode: cart.discountCode,
    discountAmount: cart.discountAmount,
    discountLabel: cart.discountAmount ? `– ${formatMoney(cart.discountAmount)}` : null,
    total: cart.total,
    totalLabel: formatMoney(cart.total),
  });
}
