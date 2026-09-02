import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy — Attestly",
  description: "Attestly's refund and cancellation policy for paid subscriptions.",
  alternates: { canonical: "https://attestly.online/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 8 }}>Refund Policy</h1>
      <p style={{ fontSize: 13, color: "var(--color-ink-faint)", marginBottom: 40 }}>Last updated: September 2026</p>

      <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-ink)" }}>
        <p>
          Attestly&apos;s subscriptions are billed and processed by Paddle.com, who acts as the Merchant of Record
          for all purchases. This means Paddle — not Attestly directly — handles the actual payment transaction,
          invoicing, and refund processing on our behalf, in line with the policy below.
        </p>

        <h2 style={h2}>Cancellations</h2>
        <p>
          You can cancel your subscription at any time from your account. Cancelling stops future billing; you
          keep access to your paid plan until the end of the current billing period, after which your account
          reverts to the free tier.
        </p>

        <h2 style={h2}>Refunds</h2>
        <p>
          If you believe you were charged in error, or you&apos;re not satisfied with Attestly within the first 7
          days of a new subscription or upgrade, email <a href="mailto:support@attestly.online" style={{ color: "var(--color-primary)" }}>support@attestly.online</a> and we'll review
          the request. Approved refunds are processed by Paddle back to your original payment method, typically
          within 5–10 business days.
        </p>
        <p>
          Refunds are generally not provided for partial billing periods after the first 7 days, or for
          usage-based charges already consumed (such as documentation generations used under a paid plan).
        </p>

        <h2 style={h2}>Disputes</h2>
        <p>
          Because Paddle is the Merchant of Record, you may also see Paddle listed as the seller on your bank or
          card statement, and Paddle&apos;s own buyer terms may apply alongside this policy. If you have a
          payment dispute, contacting us first usually resolves it faster than a chargeback.
        </p>

        <h2 style={h2}>Contact</h2>
        <p>For billing questions or refund requests, email <a href="mailto:support@attestly.online" style={{ color: "var(--color-primary)" }}>support@attestly.online</a>.</p>
      </div>
    </main>
  );
}

const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontSize: 19, marginTop: 32, marginBottom: 10 };
