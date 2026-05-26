import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const FROM = process.env.EMAIL_FROM || "Dreams Happen <onboarding@resend.dev>";

export type OrderEmail = {
  to: string;
  orderId: string;
  total: string;
  links: { title: string; url: string }[];
};

export async function sendOrderConfirmation(email: OrderEmail): Promise<void> {
  const items = email.links
    .map(
      (l) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #e6e0d2">${l.title}</td>` +
        `<td style="padding:10px 0;border-bottom:1px solid #e6e0d2;text-align:right">` +
        `<a href="${l.url}" style="color:#8a6d44;text-decoration:none">Download &rarr;</a></td></tr>`
    )
    .join("");

  const html = `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#16130f">
    <p style="letter-spacing:.28em;text-transform:uppercase;font-size:11px;color:#8a6d44">Dreams Happen</p>
    <h1 style="font-weight:400;font-size:26px">Your dossiers are ready</h1>
    <p style="color:#3a352d;line-height:1.7">Thank you for your purchase. A perpetual licence has been granted to ${email.to}. Your downloads:</p>
    <table style="width:100%;border-collapse:collapse;margin:18px 0">${items}</table>
    <p style="color:#6b6357;font-size:13px">Order ${email.orderId.slice(0, 8)} &middot; ${email.total}</p>
    <p style="color:#6b6357;font-size:12px;margin-top:28px">Dreams Happen Ltd &middot; Dubai, UAE. No advisory relationship is created.</p>
  </div>`;

  if (!resend) {
    console.log(`[email:skipped] RESEND_API_KEY not set — would email ${email.to}:`, email.links);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to: email.to,
      subject: "Your Dreams Happen dossiers",
      html,
    });
  } catch (err) {
    console.error("[email] Resend send failed", err);
  }
}
