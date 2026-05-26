import { NextResponse } from "next/server";
import { z } from "zod";
import { addSubscriber } from "@/lib/marketing";

const schema = z.object({
  email: z.string().email("Please enter a valid email."),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid email." },
      { status: 400 }
    );
  }
  const { email, source } = parsed.data;
  const added = await addSubscriber(email, source || "footer");
  return NextResponse.json({
    ok: true,
    message: added ? "You are on the list." : "You are already subscribed.",
  });
}
