import type { Metadata } from "next";
import { Anton, Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { CartProvider } from "@/components/cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ElPaisaChat from "@/components/ElPaisaChat";
import JsonLd from "@/components/JsonLd";
import { organizationLd, websiteLd } from "@/lib/jsonld";

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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
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
    images: [{ url: "/images/hero-cartagena.jpg", width: 2048, height: 878 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.brand,
    description: site.description,
    images: ["/images/hero-cartagena.jpg"],
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
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col font-sans">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
        <ElPaisaChat />
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </body>
    </html>
  );
}
