import { NextResponse } from "next/server";
import { getGrant, getOrder, recordDownload } from "@/lib/orders";
import { getProductPdf } from "@/lib/products";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const grant = await getGrant(token);
  if (!grant) {
    return NextResponse.json({ error: "Invalid or expired download link." }, { status: 404 });
  }
  const order = await getOrder(grant.order_id);
  if (!order || order.status !== "paid") {
    return NextResponse.json({ error: "This order is not paid." }, { status: 403 });
  }

  const pdf = await getProductPdf(grant.product_id);
  if (!pdf) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  await recordDownload(token);

  return new NextResponse(pdf.data as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdf.filename}"`,
      "Content-Length": String(pdf.data.length),
      "Cache-Control": "private, no-store",
    },
  });
}
