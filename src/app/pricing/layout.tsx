import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Attestly",
  description: "Self-serve pricing for Attestly's EU AI Act documentation platform. Starter, Professional, and Enterprise plans — no sales call required.",
  alternates: { canonical: "https://attestly.online/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
