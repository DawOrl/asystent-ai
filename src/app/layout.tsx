import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { company } from "@/data/company";
import { buildOrganizationJsonLd, jsonLdScript } from "@/lib/schema";
import { SiteBackground } from "@/components/ui/SiteBackground";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const title = `${company.name} — asystent AI dla małych firm`;

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: title,
    template: `%s · ${company.name}`,
  },
  description: company.shortDescription,
  applicationName: company.name,
  keywords: [
    "asystent AI",
    "chatbot dla firmy",
    "chatbot obsługa klienta",
    "generator ofert AI",
    "wdrożenie AI",
    "LLM dla małych firm",
    "Fullstack AI Developer",
  ],
  authors: [{ name: company.author, url: company.social.portfolio }],
  creator: company.author,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: company.siteUrl,
    siteName: company.name,
    title,
    description: company.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: company.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="relative min-h-dvh bg-canvas text-fg antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(buildOrganizationJsonLd()),
          }}
        />
        <SiteBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
