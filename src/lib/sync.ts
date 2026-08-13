import "server-only";

import { draftProductFromPost, geminiIsConfigured } from "./gemini";
import { fetchLatestPosts, providerStatus } from "./instagram";
import { SITE } from "./site";
import { readCatalog, saveSyncReport } from "./store";
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
 */

const LIMIT = Number(process.env.INSTAGRAM_SYNC_LIMIT ?? 12);

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
  return (
    process.env.INSTAGRAM_USERNAME?.trim() || SITE.instagram.handle.replace(/^@/, "")
  );
}

export async function runSync(): Promise<SyncReport> {
  const ranAt = new Date().toISOString();
  const status = syncStatus();

  const base: SyncReport = {
    ranAt,
    provider: status.active ?? "ninguno",
    postsFound: 0,
    newProposals: 0,
    skipped: 0,
  };

  if (!status.configured) {
    return { ...base, error: `Falta configurar ${status.missing.join(", ") || "el proveedor"}.` };
  }
  if (!status.gemini) {
    return { ...base, error: "Falta GEMINI_API_KEY." };
  }

  const catalog = await readCatalog();
  const proposals = catalog.proposals ?? [];

  // Ya vistos: los que están publicados y los que ya esperan revisión. Se
  // compara por shortcode, que es lo único estable de una publicación.
  const seen = new Set<string>();
  for (const product of catalog.products) {
    const code = shortcodeFromUrl(product.instagramUrl);
    if (code) seen.add(code);
  }
  for (const proposal of proposals) seen.add(proposal.id);

  let posts;
  try {
    posts = await fetchLatestPosts(instagramUsername(), LIMIT);
  } catch (error) {
    return { ...base, error: error instanceof Error ? error.message : "No se pudo leer Instagram." };
  }

  const nuevas = posts.filter((post) => !seen.has(post.shortcode));
  const creadas: Proposal[] = [];

  for (const post of nuevas) {
    try {
      const { draft, warnings, isProduct } = await draftProductFromPost(post);

      // Las publicaciones que no venden nada se marcan como vistas para no
      // volver a gastar una llamada en ellas mañana.
      if (!isProduct) {
        seen.add(post.shortcode);
        continue;
      }

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
    ...base,
    postsFound: posts.length,
    newProposals: creadas.length,
    skipped: posts.length - nuevas.length,
  };

  // Lo más nuevo primero, y se guardan como mucho 30 propuestas.
  const todas = [...creadas, ...proposals].slice(0, 30);
  await saveSyncReport(report, todas);

  return report;
}

function shortcodeFromUrl(url?: string): string | null {
  if (!url) return null;
  const match = /instagram\.com\/(?:p|reel|tv)\/([^/?#]+)/.exec(url);
  return match?.[1] ?? null;
}
