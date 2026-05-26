import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="May 2026"
      sections={[
        {
          heading: "1. The agreement",
          body: [
            "These terms govern your purchase and use of digital products published by Dreams Happen Ltd, registered in Dubai, United Arab Emirates. By completing a purchase you agree to them.",
          ],
        },
        {
          heading: "2. Nature of the products",
          body: [
            "All products are digital frameworks and educational dossiers delivered as PDF files. They are self-directed learning resources. They are not financial, legal, tax, immigration, or investment advice, and no advisory or fiduciary relationship is created by your purchase.",
            "We do not offer perspective. We offer the maps; you choose the destination. Any decisions you take remain entirely your own.",
          ],
        },
        {
          heading: "3. Licence",
          body: [
            "Upon payment you receive a perpetual, non-exclusive, non-transferable licence to access and read the purchased dossier for your own personal use. You may not resell, redistribute, sublicense, or publicly share the files or their contents.",
          ],
        },
        {
          heading: "4. Delivery and access",
          body: [
            "Access is granted immediately after payment is confirmed, via a secure download link shown on your confirmation page. Download links are tied to your order.",
          ],
        },
        {
          heading: "5. Liability",
          body: [
            "The products are provided “as is”. To the fullest extent permitted by law, Dreams Happen Ltd is not liable for any outcome arising from your use of the frameworks.",
          ],
        },
      ]}
    />
  );
}
