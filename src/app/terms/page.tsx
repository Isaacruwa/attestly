import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Attestly",
  description: "The terms governing use of Attestly's EU AI Act documentation platform.",
  alternates: { canonical: "https://attestly.online/terms" },
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ fontSize: 13, color: "var(--color-ink-faint)", marginBottom: 40 }}>Last updated: September 2026</p>

      <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-ink)" }}>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern access to and use of Attestly (&quot;Attestly,&quot;
          &quot;we,&quot; &quot;us&quot;), a software service that ingests operational traces from AI systems and
          generates draft EU AI Act technical documentation, risk-management summaries, conformity-assessment
          checklists, and audit-ready evidence trails for human review. By creating an account or using Attestly,
          you agree to these Terms.
        </p>

        <h2 style={h2}>1. The service and its limits</h2>
        <p>
          Attestly produces draft documentation based on data you provide or connect. Attestly is a documentation
          and workflow tool. <strong>It does not provide legal advice, does not perform a legal or regulatory
          assessment of your AI system, and does not guarantee that your organization is compliant with the EU AI
          Act or any other law.</strong> Every section Attestly generates is a draft that requires your review,
          edit, or approval before you rely on it for any purpose. You are solely responsible for verifying the
          accuracy of any generated content and for your organization&apos;s actual regulatory compliance.
        </p>

        <h2 style={h2}>2. Accounts and organizations</h2>
        <p>
          You need an account to use Attestly. You&apos;re responsible for the accuracy of the information you
          provide and for maintaining control of your account. If you invite others into your organization, you&apos;re
          responsible for their use of Attestly under your organization&apos;s subscription.
        </p>

        <h2 style={h2}>3. Your data</h2>
        <p>
          You retain ownership of the trace data, documents, and other content you upload or connect to Attestly
          (&quot;Your Data&quot;). You grant Attestly a limited license to process Your Data solely to provide the
          service — including sending relevant portions of it to third-party AI providers (see our{" "}
          <Link href="/privacy" style={{ color: "var(--color-primary)" }}>Privacy Policy</Link>) to generate draft
          documentation. We do not sell Your Data.
        </p>

        <h2 style={h2}>4. Subscriptions and billing</h2>
        <p>
          Paid plans are billed on a recurring basis through Paddle.com, our payment provider and Merchant of
          Record. Paddle handles payment processing, tax collection, and invoicing for your subscription. See our{" "}
          <Link href="/refund-policy" style={{ color: "var(--color-primary)" }}>Refund Policy</Link> for
          cancellation and refund terms. Free-tier usage limits are described on our{" "}
          <Link href="/pricing" style={{ color: "var(--color-primary)" }}>Pricing</Link> page and may change with
          notice.
        </p>

        <h2 style={h2}>5. Acceptable use</h2>
        <p>
          You agree not to use Attestly to upload unlawful content, attempt to disrupt or reverse-engineer the
          service, or misrepresent generated draft documentation as a legal certification of compliance to a
          regulator or third party without your own independent review and sign-off.
        </p>

        <h2 style={h2}>6. Disclaimers</h2>
        <p>
          Attestly is provided &quot;as is.&quot; We do not warrant that generated content is complete, accurate,
          or sufficient for any specific regulatory filing or audit. To the maximum extent permitted by law,
          Attestly disclaims all warranties, express or implied, and is not liable for indirect, incidental, or
          consequential damages arising from use of the service or reliance on generated documentation.
        </p>

        <h2 style={h2}>7. Termination</h2>
        <p>
          You may stop using Attestly and cancel your subscription at any time. We may suspend or terminate
          accounts that violate these Terms or misuse the service.
        </p>

        <h2 style={h2}>8. Changes</h2>
        <p>
          We may update these Terms from time to time. Continued use of Attestly after changes take effect
          constitutes acceptance of the updated Terms.
        </p>

        <h2 style={h2}>9. Contact</h2>
        <p>Questions about these Terms can be sent to <a href="mailto:support@attestly.online" style={{ color: "var(--color-primary)" }}>support@attestly.online</a>.</p>
      </div>
    </main>
  );
}

const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontSize: 19, marginTop: 32, marginBottom: 10 };
