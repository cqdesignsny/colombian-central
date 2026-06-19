import type { Metadata } from "next";
import { Anton, Archivo, Instrument_Serif, Fraunces } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { CartProvider } from "@/components/cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ElPaisaChat from "@/components/ElPaisaChat";
import ScrollToTop from "@/components/ScrollToTop";
import ImageProtect from "@/components/ImageProtect";
import JsonLd from "@/components/JsonLd";
import { organizationLd, websiteLd } from "@/lib/jsonld";
import { Analytics } from "@vercel/analytics/next";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
});

// Editorial reading serif for body/paragraph copy: warm, literary, and a little
// Macondo. Levels up the prose without touching the Anton headlines.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  alternates: { canonical: "./" },
  title: {
    default: `${site.brand} | ${site.tagline}`,
    template: `%s | ${site.brand}`,
  },
  description: site.description,
  openGraph: {
    title: site.brand,
    description: site.description,
    url: site.url,
    siteName: site.brand,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
    locale: "es_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.brand,
    description: site.description,
    images: ["/images/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${anton.variable} ${archivo.variable} ${instrument.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col font-sans">
        <ScrollToTop />
        <ImageProtect />
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
        <ElPaisaChat />
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <Analytics />
      </body>
    </html>
  );
}
