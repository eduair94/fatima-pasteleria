/**
 * Publicación de Instagram, ya normalizada. Cada proveedor devuelve una forma
 * distinta; el resto del código sólo conoce esta.
 */
export type InstagramPost = {
  /** Shortcode de la publicación. Es la clave para no procesar dos veces. */
  shortcode: string;
  url: string;
  caption: string;
  /** Portada primero. Las URLs de Instagram caducan en días. */
  imageUrls: string[];
  postedAt: string;
  isVideo: boolean;
};

export type ProviderName = "apify" | "rapidapi";

export type FetchOptions = {
  username: string;
  limit: number;
};

export interface InstagramProvider {
  readonly name: ProviderName;
  /** Si faltan las variables de entorno, el proveedor no está disponible. */
  isConfigured(): boolean;
  /** Qué variable falta, para poder decirlo en el panel. */
  missingConfig(): string[];
  fetchLatestPosts(options: FetchOptions): Promise<InstagramPost[]>;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly provider: ProviderName,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

/** Los proveedores devuelven fechas en formatos distintos. */
export function toIsoDate(value: unknown): string {
  if (typeof value === "number") {
    // Segundos o milisegundos según el proveedor.
    const ms = value > 1e12 ? value : value * 1000;
    return new Date(ms).toISOString();
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  }
  return new Date().toISOString();
}

export function firstString(...candidates: unknown[]): string {
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return "";
}
