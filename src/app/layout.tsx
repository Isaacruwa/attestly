import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-plex-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = "https://attestly-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Attestly — EU AI Act evidence, generated from what your agents already do",
  description:
    "Attestly turns your AI agents' operational traces into audit-ready EU AI Act documentation, continuously.",
  keywords: [
    "EU AI Act compliance",
    "AI Act technical documentation",
    "Annex IV documentation",
    "AI agent compliance",
    "AI risk management documentation",
    "AI conformity assessment",
    "agentic AI compliance software",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Attestly",
    title: "Attestly — EU AI Act evidence, generated from what your agents already do",
    description:
      "Attestly turns your AI agents' operational traces into audit-ready EU AI Act documentation, continuously.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Attestly — EU AI Act evidence, generated from what your agents already do",
    description:
      "Attestly turns your AI agents' operational traces into audit-ready EU AI Act documentation, continuously.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
