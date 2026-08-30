import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Attestly — EU AI Act evidence, generated from what your agents already do",
  description:
    "Attestly turns your AI agents' operational traces into audit-ready EU AI Act documentation, continuously.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
