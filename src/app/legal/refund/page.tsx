import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      updated="May 2026"
      sections={[
        {
          heading: "Digital goods",
          body: [
            "Our products are digital dossiers delivered instantly. Because access is granted immediately upon purchase, all sales are final and non-refundable once the download has been made available.",
          ],
        },
        {
          heading: "Exceptions",
          body: [
            "If a file is corrupted, fails to download, or you were charged in error, contact us within 14 days at hello@dreamshappenltd.com and we will make it right — by re-issuing access or, where appropriate, a refund.",
          ],
        },
        {
          heading: "How to reach us",
          body: [
            "Email hello@dreamshappenltd.com with your order reference. We respond to refund enquiries within two business days.",
          ],
        },
      ]}
    />
  );
}
