import "server-only";

import { draftProductFromPost, geminiIsConfigured } from "./gemini";
import { activeProvider, providerStatus } from "./instagram";
import type { InstagramPost } from "./instagram";
import { SITE } from "./site";
import { readCatalog, writeCatalog } from "./store";
import type { Proposal, SyncReport } from "./types";

/**
 * Sincronización con Instagram.
 *
 * Trae las últimas publicaciones, descarta las que ya están en el catálogo o
 * ya fueron revisadas, y de las nuevas arma una propuesta de producto.
 *
 * **Nada se publica solo.** Todo queda como propuesta, esperando aprobación en
 * el panel. Un precio mal leído y publicado sin mirar es peor que un producto
 * que tarda un día en aparecer.
 *
 * El scraper tarda entre 18 y 39 segundos y no hay forma de acotarlo, así que
 * cuando el proveedor lo permite el trabajo va en dos fases: `runSync` lo
 * arranca y devuelve `pendiente`, y las llamadas siguientes lo recolectan. El
 * panel consulta cada pocos segundos; el cron recolecta lo que haya quedado de
 * la corrida anterior antes de arrancar una nueva.
 */

/** Corriendo todos los días, seis publicaciones cubren cualquier racha. */
const LIMIT = Number(process.env.INSTAGRAM_SYNC_LIMIT ?? 6);

export function syncStatus() {
  const provider = providerStatus();
  return {
    ...provider,
    gemini: geminiIsConfigured(),
    username: instagramUsername(),
    ready: provider.configured && geminiIsConfigured(),
  };
}

function instagramUsername(): string {
  return process.env.INSTAGRAM_USERNAME?.trim() || SITE.instagram.handle.replace(/^@/, "");
}

function emptyReport(provider: string | null): SyncReport {
  return {
    ranAt: new Date().toISOString(),
    provider: provider ?? "ninguno",
    postsFound: 0,
    newProposals: 0,
    skipped: 0,
  };
}

export type SyncOutcome =
  | { state: "pendiente"; startedAt: string }
  | { state: "listo"; report: SyncReport };

/**
 * Arranca una búsqueda, o recolecta la que estaba corriendo.
 *
 * Se llama repetidamente sin problema: si hay un trabajo en curso lo revisa en
 * lugar de arrancar otro.
 */
export async function runSync(): Promise<SyncOutcome> {
  const status = syncStatus();
  const provider = activeProvider();

  if (!provider || !status.configured) {
    return {
      state: "listo",
      report: {
        ...emptyReport(status.active),
        error: `Falta configurar ${status.missing.join(", ") || "el proveedor"}.`,
      },
    };
  }
  if (!status.gemini) {
    return { state: "listo", report: { ...emptyReport(status.active), error: "Falta GEMINI_API_KEY." } };
  }

  const catalog = await readCatalog({ fresh: true });
  const pending = catalog.pendingJob;

  // --- Fase 2: hay un trabajo en curso ---------------------------------
  if (pending && provider.collectJob) {
    // Un trabajo que lleva más de quince minutos se da por perdido.
    const edad = Date.now() - Date.parse(pending.startedAt);
    if (edad > 15 * 60 * 1000) {
      await writeCatalog({ ...catalog, pendingJob: null });
      return {
        state: "listo",
        report: { ...emptyReport(status.active), error: "La búsqueda anterior quedó colgada. Probá de nuevo." },
      };
    }

    let result;
    try {
      result = await provider.collectJob(pending.jobId);
    } catch (error) {
      await writeCatalog({ ...catalog, pendingJob: null });
      return {
        state: "listo",
        report: {
          ...emptyReport(status.active),
          error: error instanceof Error ? error.message : "No se pudo leer el resultado.",
        },
      };
    }

    if (!result.done) return { state: "pendiente", startedAt: pending.startedAt };

    if ("failed" in result) {
      await writeCatalog({ ...catalog, pendingJob: null });
      return { state: "listo", report: { ...emptyReport(status.active), error: result.reason } };
    }

    const report = await processPosts(result.posts, status.active ?? "apify");
    return { state: "listo", report };
  }

  // --- Fase 1: arrancar -------------------------------------------------
  if (provider.startJob) {
    try {
      const jobId = await provider.startJob({ username: instagramUsername(), limit: LIMIT });
      const startedAt = new Date().toISOString();
      await writeCatalog({ ...catalog, pendingJob: { jobId, startedAt } });
      return { state: "pendiente", startedAt };
    } catch (error) {
      return {
        state: "listo",
        report: {
          ...emptyReport(status.active),
          error: error instanceof Error ? error.message : "No se pudo arrancar la búsqueda.",
        },
      };
    }
  }

  // --- Proveedor de una sola fase (RapidAPI) ----------------------------
  try {
    const posts = await provider.fetchLatestPosts({ username: instagramUsername(), limit: LIMIT });
    return { state: "listo", report: await processPosts(posts, status.active ?? "rapidapi") };
  } catch (error) {
    return {
      state: "listo",
      report: {
        ...emptyReport(status.active),
        error: error instanceof Error ? error.message : "No se pudo leer Instagram.",
      },
    };
  }
}

/** Descarta lo ya visto y arma una propuesta por cada publicación nueva. */
async function processPosts(posts: InstagramPost[], provider: string): Promise<SyncReport> {
  const catalog = await readCatalog({ fresh: true });
  const proposals = catalog.proposals ?? [];

  // Ya vistos: los publicados y los que esperan revisión. Se compara por
  // shortcode, que es lo único estable de una publicación.
  //
  // Las propuestas que quedaron con error NO cuentan como vistas: si Gemini
  // estaba saturado, la corrida siguiente vuelve a intentarlas sola.
  const seen = new Set<string>();
  for (const product of catalog.products) {
    const code = shortcodeFromUrl(product.instagramUrl);
    if (code) seen.add(code);
  }
  for (const proposal of proposals) {
    if (!proposal.error) seen.add(proposal.id);
  }

  const nuevas = posts.filter((post) => !seen.has(post.shortcode));
  const creadas: Proposal[] = [];

  for (const post of nuevas) {
    try {
      const { draft, warnings, isProduct } = await draftProductFromPost(post);

      // Las publicaciones que no venden nada se saltean: no vuelven a gastar
      // una llamada mañana porque igual quedan fuera por fecha.
      if (!isProduct) continue;

      creadas.push({
        id: post.shortcode,
        postUrl: post.url,
        postedAt: post.postedAt,
        caption: post.caption,
        imageUrls: post.imageUrls,
        draft,
        warnings,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      // Si el modelo falla, la publicación igual se guarda: con la foto y la
      // caption a la vista se puede cargar a mano.
      creadas.push({
        id: post.shortcode,
        postUrl: post.url,
        postedAt: post.postedAt,
        caption: post.caption,
        imageUrls: post.imageUrls,
        draft: { instagramUrl: post.url },
        warnings: [],
        error: error instanceof Error ? error.message : "No se pudo leer la publicación.",
        createdAt: new Date().toISOString(),
      });
    }
  }

  const report: SyncReport = {
    ranAt: new Date().toISOString(),
    provider,
    postsFound: posts.length,
    newProposals: creadas.length,
    skipped: posts.length - nuevas.length,
  };

  // Las recién armadas reemplazan a su versión anterior fallida.
  const rehechas = new Set(creadas.map((proposal) => proposal.id));
  const conservadas = proposals.filter((proposal) => !rehechas.has(proposal.id));

  await writeCatalog({
    ...catalog,
    proposals: [...creadas, ...conservadas].slice(0, 30),
    lastSync: report,
    pendingJob: null,
  });

  return report;
}

/**
 * Saca el shortcode de una URL de publicación. Instagram sirve las dos formas
 * —`/p/CODE/` y `/usuario/p/CODE/`— y la cuenta usa la segunda: sin contemplar
 * el segmento del usuario, la deduplicación no reconocía nada y proponía de
 * nuevo productos que ya estaban publicados.
 */
function shortcodeFromUrl(url?: string): string | null {
  if (!url) return null;
  const match = /instagram\.com\/(?:[^/]+\/)?(?:p|reel|tv|reels)\/([^/?#]+)/.exec(url);
  return match?.[1] ?? null;
}
