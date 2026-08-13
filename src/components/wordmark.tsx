import Link from "next/link";

/**
 * Lockup tipográfico. El sello original es un JPG sobre crema y no se puede
 * poner sobre foto ni sobre marrón, así que en el header y en el pie se usa
 * esta versión. Ver readme del sistema, "Marca sobre foto".
 */
export function Wordmark({
  href = "/",
  inverse = false,
  size = 19,
  className = "",
}: {
  href?: string | null;
  inverse?: boolean;
  size?: number;
  className?: string;
}) {
  const content = (
    <span className={`inline-flex flex-col items-center gap-[2px] ${className}`}>
      <span
        className="font-serif leading-none"
        style={{
          fontSize: size,
          letterSpacing: "0.01em",
          color: inverse ? "var(--cream-50)" : "var(--brown-900)",
        }}
      >
        Fátima
      </span>
      <span
        className="font-sans font-medium uppercase leading-none"
        style={{
          fontSize: Math.max(8, Math.round(size * 0.42)),
          letterSpacing: "var(--tracking-caps)",
          color: inverse ? "var(--gold-200)" : "var(--brown-500)",
        }}
      >
        Pastelería Artesanal
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="Fátima — Pastelería Artesanal, ir al inicio" className="no-underline">
      {content}
    </Link>
  );
}
