import type { Metadata } from "next";
import { buildMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildMetadata({
  title: "Pricing — Attestly",
  description:
    "Self-serve pricing for Attestly's EU AI Act documentation platform. Starter, Professional, and Enterprise plans — no sales call required.",
  path: "/pricing",
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
