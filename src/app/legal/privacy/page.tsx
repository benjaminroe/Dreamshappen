import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="May 2026"
      sections={[
        {
          heading: "What we collect",
          body: [
            "We collect the email address you provide at checkout or when subscribing to The Dispatch, and the order details necessary to deliver your purchase. Payment card details are processed by our payment provider and are never stored on our servers.",
          ],
        },
        {
          heading: "How we use it",
          body: [
            "Your email is used to deliver your purchase, provide download access, and — only if you subscribe — to send occasional dispatches. We do not sell your data.",
          ],
        },
        {
          heading: "Payment processing",
          body: [
            "Payments are handled securely by Stripe. Their handling of your payment information is governed by Stripe’s own privacy policy.",
          ],
        },
        {
          heading: "Your choices",
          body: [
            "You may unsubscribe from The Dispatch at any time, and you may request deletion of your personal data by contacting hello@dreamshappenltd.com.",
          ],
        },
      ]}
    />
  );
}
