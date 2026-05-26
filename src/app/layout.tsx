import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dreams Happen — Strategic Frameworks for the Global Citizen",
    template: "%s · Dreams Happen",
  },
  description:
    "Architecture of life, jurisdictional thinking, and long-term power. Self-directed strategic frameworks delivered as digital dossiers. Dubai, UAE.",
  keywords: [
    "strategic frameworks",
    "global citizen",
    "jurisdictional thinking",
    "digital publishing",
    "Dubai",
  ],
  openGraph: {
    title: "Dreams Happen — Strategic Frameworks for the Global Citizen",
    description:
      "Architecture of life, jurisdictional thinking, and long-term power. Digital dossiers from Dubai.",
    url: SITE_URL,
    siteName: "Dreams Happen Ltd",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
