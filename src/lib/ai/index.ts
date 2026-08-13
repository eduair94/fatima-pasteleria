import type { InstagramPost } from "../instagram";
import type { ProductDraft, ProductExtractor } from "./contract";
import { geminiExtractor } from "./gemini";
import { grokExtractor } from "./grok";

export type { ProductDraft } from "./contract";

/**
 * Quién lee las publicaciones. Grok primero, Gemini después.
 *
 * Son intercambiables porque los dos fallan por motivos distintos: el free
 * tier de Gemini se satura y devuelve 503, y xAI corta con 403 cuando la
 * cuenta se queda sin crédito. Teniendo los dos configurados, la corrida sale
 * adelante si cualquiera de ellos está disponible.
 *
 * Se elige con AI_PROVIDER; si no está definida, el primero que tenga clave.
 */
const EXTRACTORS: ProductExtractor[] = [grokExtractor, geminiExtractor];

export function activeExtractor(): ProductExtractor | null {
  const preferred = process.env.AI_PROVIDER?.trim();

  if (preferred) {
    return EXTRACTORS.find((extractor) => extractor.name === preferred) ?? null;
  }

  return EXTRACTORS.find((extractor) => extractor.isConfigured()) ?? null;
}

export function extractorStatus() {
  const active = activeExtractor();
  const configurados = EXTRACTORS.filter((extractor) => extractor.isConfigured());

  return {
    active: active?.name ?? null,
    configured: Boolean(active?.isConfigured()),
    missing: active?.missingConfig() ?? ["XAI_API_KEY o GEMINI_API_KEY"],
    /** Los que pueden tomar el relevo si el elegido falla. */
    respaldos: configurados.filter((extractor) => extractor !== active).map((e) => e.name),
    available: EXTRACTORS.map((extractor) => ({
      name: extractor.name,
      configured: extractor.isConfigured(),
    })),
  };
}

/**
 * Arma la ficha. Si el proveedor elegido falla, prueba con los otros que estén
 * configurados antes de darse por vencido.
 */
export async function draftProductFromPost(post: InstagramPost): Promise<ProductDraft> {
  const active = activeExtractor();
  if (!active) throw new Error("No hay ningún modelo configurado.");

  const cadena = [active, ...EXTRACTORS.filter((e) => e !== active && e.isConfigured())];
  const errores: string[] = [];

  for (const extractor of cadena) {
    try {
      return await extractor.extract(post);
    } catch (error) {
      errores.push(`${extractor.name}: ${error instanceof Error ? error.message : "falló"}`);
    }
  }

  throw new Error(errores.join(" · "));
}
