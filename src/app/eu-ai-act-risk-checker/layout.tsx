import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU AI Act Risk Checker — Free Tool | Attestly",
  description:
    "Answer a few questions about your AI system and get a directional EU AI Act risk classification (prohibited, high-risk, limited, or minimal) based on Article 5 and Annex III. Free, no signup required.",
  alternates: { canonical: "https://attestly.online/eu-ai-act-risk-checker" },
};

export default function RiskCheckerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
