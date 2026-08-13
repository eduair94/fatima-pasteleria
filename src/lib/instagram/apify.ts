import {
  type FetchOptions,
  type InstagramPost,
  type InstagramProvider,
  type JobResult,
  ProviderError,
  firstString,
  toIsoDate,
} from "./types";

/**
 * Apify — actor `apify/instagram-scraper`.
 *
 * El plan gratuito da USD 5 de crédito por mes y el actor cobra por resultado,
 * así que una corrida diaria de 12 publicaciones gasta centavos. Es el
 * proveedor con datos más completos de los tres que probamos.
 *
 * Se usa el endpoint sincrónico: se lanza el actor y se esperan los items en
 * la misma llamada. El tope de duración de una función en Vercel Hobby es de
 * 60 s, así que al actor se le pide terminar antes.
 */

const ACTOR = process.env.APIFY_ACTOR_ID?.trim() || "apify~instagram-scraper";

/**
 * El actor tarda entre 15 y 25 segundos con pocas publicaciones, y se pasa del
 * minuto si se le piden doce. Como el tope de una función en Vercel Hobby son
 * 60 s, se le pide poco y con ventana de fechas: corriendo todos los días,
 * mirar el último mes alcanza de sobra.
 */
const TIMEOUT_SECONDS = 50;
const WINDOW = process.env.INSTAGRAM_SYNC_WINDOW?.trim() || "30 days";

export const apifyProvider: InstagramProvider = {
  name: "apify",

  isConfigured() {
    return Boolean(process.env.APIFY_TOKEN?.trim());
  },

  missingConfig() {
    return process.env.APIFY_TOKEN?.trim() ? [] : ["APIFY_TOKEN"];
  },

  async fetchLatestPosts({ username, limit }: FetchOptions): Promise<InstagramPost[]> {
    const token = process.env.APIFY_TOKEN?.trim();
    if (!token) throw new ProviderError("Falta APIFY_TOKEN.", "apify");

    const url =
      `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items` +
      `?token=${encodeURIComponent(token)}&timeout=${TIMEOUT_SECONDS}&clean=true&limit=${limit}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          directUrls: [`https://www.instagram.com/${username}/`],
          resultsType: "posts",
          resultsLimit: limit,
          onlyPostsNewerThan: WINDOW,
          addParentData: false,
        }),
      });
    } catch (error) {
      throw new ProviderError(
        `No se pudo hablar con Apify: ${error instanceof Error ? error.message : "error de red"}`,
        "apify",
      );
    }

    if (response.status === 408) {
      throw new ProviderError(
        "Apify tardó más de 45 segundos. Probá de nuevo en un rato.",
        "apify",
        408,
      );
    }

    if (!response.ok) {
      throw new ProviderError(
        `Apify respondió ${response.status}: ${(await response.text()).slice(0, 200)}`,
        "apify",
        response.status,
      );
    }

    const items = (await response.json()) as Record<string, unknown>[];
    if (!Array.isArray(items)) {
      throw new ProviderError("Apify devolvió algo que no es una lista.", "apify");
    }

    return items.map(normalize).filter((post): post is InstagramPost => post !== null);
  },

  /** Arranca el actor y devuelve enseguida el id de la corrida. */
  async startJob({ username, limit }: FetchOptions): Promise<string> {
    const run = (await call(`acts/${ACTOR}/runs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        directUrls: [`https://www.instagram.com/${username}/`],
        resultsType: "posts",
        resultsLimit: limit,
        onlyPostsNewerThan: WINDOW,
        addParentData: false,
      }),
    })) as { data?: { id?: string } };

    const id = run.data?.id;
    if (!id) throw new ProviderError("Apify no devolvió el id de la corrida.", "apify");
    return id;
  },

  async collectJob(jobId: string): Promise<JobResult> {
    const run = (await call(`actor-runs/${jobId}`)) as {
      data?: { status?: string; defaultDatasetId?: string; statusMessage?: string };
    };

    const status = run.data?.status;
    if (status === "READY" || status === "RUNNING") return { done: false };

    if (status !== "SUCCEEDED") {
      return {
        done: true,
        failed: true,
        reason: run.data?.statusMessage || `La corrida terminó en estado ${status}.`,
      };
    }

    const dataset = run.data?.defaultDatasetId;
    if (!dataset) return { done: true, posts: [] };

    const items = (await call(`datasets/${dataset}/items?clean=true`)) as Record<string, unknown>[];
    if (!Array.isArray(items)) return { done: true, posts: [] };

    return {
      done: true,
      posts: items.map(normalize).filter((post): post is InstagramPost => post !== null),
    };
  },
};

/** Llamada a la API de Apify con el token, devolviendo JSON. */
async function call(path: string, init?: RequestInit): Promise<unknown> {
  const token = process.env.APIFY_TOKEN?.trim();
  if (!token) throw new ProviderError("Falta APIFY_TOKEN.", "apify");

  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(
    `https://api.apify.com/v2/${path}${separator}token=${encodeURIComponent(token)}`,
    { ...init, cache: "no-store" },
  );

  if (!response.ok) {
    throw new ProviderError(
      `Apify respondió ${response.status}: ${(await response.text()).slice(0, 200)}`,
      "apify",
      response.status,
    );
  }

  return response.json();
}

function normalize(item: Record<string, unknown>): InstagramPost | null {
  const shortcode = firstString(item.shortCode, item.shortcode, item.id);
  if (!shortcode) return null;

  const children = Array.isArray(item.childPosts) ? (item.childPosts as Record<string, unknown>[]) : [];
  const gallery = Array.isArray(item.images) ? (item.images as unknown[]) : [];

  const imageUrls = [
    firstString(item.displayUrl, item.imageUrl),
    ...gallery.map((image) => firstString(image)),
    ...children.map((child) => firstString(child.displayUrl, child.imageUrl)),
  ].filter((value, index, all) => value && all.indexOf(value) === index);

  return {
    shortcode,
    url: firstString(item.url, `https://www.instagram.com/p/${shortcode}/`),
    caption: firstString(item.caption),
    imageUrls: imageUrls.slice(0, 4),
    postedAt: toIsoDate(item.timestamp),
    isVideo: item.type === "Video" || item.isVideo === true,
  };
}
