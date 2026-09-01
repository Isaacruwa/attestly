import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Attestly",
  description: "How Attestly collects, uses, and protects your data.",
  alternates: { canonical: "https://attestly.online/privacy" },
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ fontSize: 13, color: "var(--color-ink-faint)", marginBottom: 40 }}>Last updated: September 2026</p>

      <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-ink)" }}>
        <p>
          This Privacy Policy explains what data Attestly collects, why, and how it&apos;s handled. Attestly is
          built for compliance-sensitive customers, so we try to collect and retain no more than the service
          actually needs.
        </p>

        <h2 style={h2}>1. What we collect</h2>
        <p>
          <strong>Account information:</strong> your email address, and organization name/membership.
          <br />
          <strong>Content you provide:</strong> AI system descriptions, imported trace/event data, generated
          documentation, and edits or approvals you make.
          <br />
          <strong>Billing information:</strong> handled entirely by Paddle.com, our payment processor — Attestly
          does not receive or store your payment card details.
          <br />
          <strong>Basic usage data:</strong> standard web server logs and error logs needed to operate and secure
          the service.
        </p>

        <h2 style={h2}>2. How we use it</h2>
        <p>
          We use your data to operate the service: authenticating you, storing your organization&apos;s AI systems
          and traces, mapping evidence to compliance requirements, generating draft documentation, and sending
          service-related email (sign-in codes, team invitations).
        </p>

        <h2 style={h2}>3. Third-party subprocessors</h2>
        <p>
          Attestly relies on a small number of third-party providers to operate:
        </p>
        <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
          <li><strong>Supabase</strong> — database, authentication, and file storage.</li>
          <li><strong>Google (Gemini API)</strong> — processes trace evidence you&apos;ve linked to a documentation
            section in order to draft that section&apos;s text.</li>
          <li><strong>Resend</strong> — delivers transactional email (sign-in codes, team invitations).</li>
          <li><strong>Paddle.com</strong> — processes payments and acts as Merchant of Record for subscriptions.</li>
          <li><strong>Vercel</strong> — hosts the application.</li>
        </ul>
        <p>
          Each provider only receives the data necessary to perform its function. We do not sell your data to
          anyone, including these providers, for their own independent use.
        </p>

        <h2 style={h2}>4. Data retention</h2>
        <p>
          We retain your account and organization data for as long as your account is active. You can request
          deletion of your account and associated data at any time by contacting us.
        </p>

        <h2 style={h2}>5. Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, export, or delete your personal
          data. Contact us using the address on our homepage to exercise these rights.
        </p>

        <h2 style={h2}>6. Security</h2>
        <p>
          We use industry-standard measures including encrypted connections (HTTPS), row-level database access
          controls, and least-privilege service credentials. No system is perfectly secure, and we can&apos;t
          guarantee absolute security of information transmitted to or stored by the service.
        </p>

        <h2 style={h2}>7. Changes</h2>
        <p>We may update this policy from time to time. Material changes will be reflected by updating the date above.</p>

        <h2 style={h2}>8. Contact</h2>
        <p>Questions about this policy can be sent to the contact address listed on our homepage.</p>
      </div>
    </main>
  );
}

const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontSize: 19, marginTop: 32, marginBottom: 10 };
