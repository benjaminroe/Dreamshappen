import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getGrant, getOrder, productForGrant, recordDownload } from "@/lib/orders";

const PDF_DIR = path.join(process.cwd(), "private", "pdfs");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const grant = getGrant(token);
  if (!grant) {
    return NextResponse.json({ error: "Invalid or expired download link." }, { status: 404 });
  }
  const order = getOrder(grant.order_id);
  if (!order || order.status !== "paid") {
    return NextResponse.json({ error: "This order is not paid." }, { status: 403 });
  }
  const product = productForGrant(grant);
  if (!product || !product.pdf_filename) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  // Guard against path traversal — only allow a bare filename inside PDF_DIR.
  const safeName = path.basename(product.pdf_filename);
  const filePath = path.join(PDF_DIR, safeName);
  if (!filePath.startsWith(PDF_DIR)) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  let data: Buffer;
  try {
    data = await readFile(filePath);
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  recordDownload(token);

  const filename = `${product.slug}.pdf`;
  return new NextResponse(data as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(data.length),
      "Cache-Control": "private, no-store",
    },
  });
}
