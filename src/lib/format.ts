const TZ = "America/Montevideo";

/** `$ 1.100` — pesos uruguayos, punto de miles, sin decimales, espacio fino. */
export function formatPrice(value: number): string {
  return `$ ${new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 }).format(value)}`;
}

/** Precio de una variante, o "Consultar" si no hay precio publicado. */
export function formatVariantPrice(price: number | null): string {
  return price === null ? "Consultar" : formatPrice(price);
}

/** `viernes 14 de agosto` — sin la coma que mete Intl después del día. */
export function formatDateLong(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat("es-UY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  })
    .format(date)
    .replace(",", "");
}

/** `14 de agosto` */
export function formatDateShort(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat("es-UY", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(date);
}

function parseISODate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

/** Fecha de hoy en Montevideo, como `YYYY-MM-DD`. */
export function todayInMontevideo(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return parts;
}

/**
 * Primera fecha de entrega posible. La anticipación se cuenta en horas y se
 * redondea al día siguiente completo: con 48 hs, pedir hoy habilita pasado
 * mañana.
 */
export function firstAvailableDate(leadTimeHours: number, now: Date = new Date()): string {
  const today = todayInMontevideo(now);
  const days = Math.ceil(leadTimeHours / 24);
  return addDays(today, days);
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Referencia local para que cliente y Fátima hablen del mismo pedido. */
export function orderReference(now: Date = new Date()): string {
  const date = todayInMontevideo(now).slice(2).replace(/-/g, "");
  const random = Math.floor(Math.random() * 90 + 10);
  return `FP-${date}-${random}`;
}

/** Teléfono uruguayo en formato legible: 099 123 456. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 9 && digits.startsWith("0")) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return raw.trim();
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
