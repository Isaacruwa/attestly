import Link from "next/link";

type Locale = "en" | "fr" | "de";

// A visible language switcher. `paths` maps each available locale to the
// equivalent page (not the homepage), so switching language never loses the
// visitor's place. Only locales present in `paths` are rendered as links;
// the current locale renders as plain text.
export default function LanguageSwitcher({
  current,
  paths,
}: {
  current: Locale;
  paths: Partial<Record<Locale, string>>;
}) {
  const labels: Record<Locale, string> = { en: "EN", fr: "FR", de: "DE" };
  const order: Locale[] = ["en", "fr", "de"];

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12.5 }}>
      {order
        .filter((locale) => paths[locale])
        .map((locale, i, arr) => (
          <span key={locale} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {locale === current ? (
              <span style={{ color: "var(--color-ink)", fontWeight: 600 }}>{labels[locale]}</span>
            ) : (
              <Link href={paths[locale]!} style={{ color: "var(--color-ink-muted)", textDecoration: "none" }}>
                {labels[locale]}
              </Link>
            )}
            {i < arr.length - 1 && <span style={{ color: "var(--color-line)" }}>|</span>}
          </span>
        ))}
    </div>
  );
}
