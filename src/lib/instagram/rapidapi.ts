import {
  type FetchOptions,
  type InstagramPost,
  type InstagramProvider,
  ProviderError,
  firstString,
  toIsoDate,
} from "./types";

/**
 * RapidAPI — genérico a propósito.
 *
 * En RapidAPI hay una docena de scrapers de Instagram y cambian de nombre, de
 * ruta y de forma de respuesta seguido. Por eso el host y la ruta son
 * variables de entorno, y la normalización recorre las formas que usan casi
 * todos en lugar de atarse a una sola.
 *
 *   RAPIDAPI_KEY   clave de la cuenta
 *   RAPIDAPI_HOST  p. ej. instagram-scraper-api2.p.rapidapi.com
 *   RAPIDAPI_PATH  p. ej. /v1.2/posts?username_or_id_or_url={username}
 *
 * En RAPIDAPI_PATH, `{username}` se reemplaza por la cuenta.
 * El panel tiene un botón para ver la respuesta cruda y ajustar la ruta.
 */

export const rapidApiProvider: InstagramProvider = {
  name: "rapidapi",

  isConfigured() {
    return Boolean(
      process.env.RAPIDAPI_KEY?.trim() &&
        process.env.RAPIDAPI_HOST?.trim() &&
        process.env.RAPIDAPI_PATH?.trim(),
    );
  },

  missingConfig() {
    return (["RAPIDAPI_KEY", "RAPIDAPI_HOST", "RAPIDAPI_PATH"] as const).filter(
      (name) => !process.env[name]?.trim(),
    );
  },

  async fetchLatestPosts({ username, limit }: FetchOptions): Promise<InstagramPost[]> {
    const key = process.env.RAPIDAPI_KEY?.trim();
    const host = process.env.RAPIDAPI_HOST?.trim();
    const path = process.env.RAPIDAPI_PATH?.trim();

    if (!key || !host || !path) {
      throw new ProviderError("Falta configurar RapidAPI.", "rapidapi");
    }

    const url = `https://${host}${path.startsWith("/") ? "" : "/"}${path.replace(
      /\{username\}/g,
      encodeURIComponent(username),
    )}`;

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { "x-rapidapi-key": key, "x-rapidapi-host": host },
        cache: "no-store",
      });
    } catch (error) {
      throw new ProviderError(
        `No se pudo hablar con RapidAPI: ${error instanceof Error ? error.message : "error de red"}`,
        "rapidapi",
      );
    }

    if (!response.ok) {
      throw new ProviderError(
        `RapidAPI respondió ${response.status}: ${(await response.text()).slice(0, 200)}`,
        "rapidapi",
        response.status,
      );
    }

    const payload = (await response.json()) as unknown;
    const items = extractItems(payload);

    if (items.length === 0) {
      throw new ProviderError(
        "RapidAPI respondió, pero no se encontró ninguna publicación en la respuesta. " +
          "Revisá RAPIDAPI_PATH con el botón de probar conexión.",
        "rapidapi",
      );
    }

    return items
      .map(normalize)
      .filter((post): post is InstagramPost => post !== null)
      .slice(0, limit);
  },
};

/** Busca la lista de publicaciones en las formas que usan estos servicios. */
function extractItems(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  const candidates: unknown[] = [
    root.items,
    root.posts,
    root.data,
    (root.data as Record<string, unknown> | undefined)?.items,
    (root.data as Record<string, unknown> | undefined)?.posts,
    (root.data as Record<string, unknown> | undefined)?.edges,
    (root.result as Record<string, unknown> | undefined)?.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      // Algunas respuestas envuelven cada item en { node: {...} }.
      return (candidate as Record<string, unknown>[]).map((entry) =>
        entry && typeof entry === "object" && "node" in entry
          ? ((entry as { node: Record<string, unknown> }).node ?? entry)
          : entry,
      );
    }
  }

  return [];
}

function normalize(item: Record<string, unknown>): InstagramPost | null {
  const shortcode = firstString(item.code, item.shortcode, item.shortCode, item.id, item.pk);
  if (!shortcode) return null;

  return {
    shortcode,
    url: firstString(item.url, item.permalink, `https://www.instagram.com/p/${shortcode}/`),
    caption: extractCaption(item),
    imageUrls: extractImages(item).slice(0, 4),
    postedAt: toIsoDate(item.taken_at ?? item.taken_at_timestamp ?? item.timestamp ?? item.created_at),
    isVideo: Boolean(item.is_video ?? item.video_url ?? item.media_type === 2),
  };
}

function extractCaption(item: Record<string, unknown>): string {
  const caption = item.caption;
  if (typeof caption === "string") return caption;
  if (caption && typeof caption === "object") {
    return firstString((caption as Record<string, unknown>).text);
  }
  return firstString(item.caption_text, item.text, item.title);
}

function extractImages(item: Record<string, unknown>): string[] {
  const urls: string[] = [];

  const push = (value: unknown) => {
    const url = firstString(value);
    if (url.startsWith("http") && !urls.includes(url)) urls.push(url);
  };

  // Forma clásica de la API interna: image_versions2.candidates[].url
  const candidates = (item.image_versions2 as Record<string, unknown> | undefined)?.candidates;
  if (Array.isArray(candidates) && candidates.length > 0) {
    push((candidates[0] as Record<string, unknown>).url);
  }

  push(item.display_url);
  push(item.displayUrl);
  push(item.thumbnail_url);
  push(item.image_url);

  const carousel = item.carousel_media ?? item.carousel;
  if (Array.isArray(carousel)) {
    for (const media of carousel as Record<string, unknown>[]) {
      const mediaCandidates = (media.image_versions2 as Record<string, unknown> | undefined)?.candidates;
      if (Array.isArray(mediaCandidates) && mediaCandidates.length > 0) {
        push((mediaCandidates[0] as Record<string, unknown>).url);
      }
      push(media.display_url);
      push(media.thumbnail_url);
    }
  }

  return urls;
}
