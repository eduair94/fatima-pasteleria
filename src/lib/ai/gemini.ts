import type { InstagramPost } from "../instagram";
import {
  type ProductDraft,
  type ProductExtractor,
  SCHEMA,
  downloadImage,
  esTransitorio,
  esperar,
  promptFor,
  toDraft,
  toGeminiSchema,
} from "./contract";

/**
 * Gemini, de Google AI Studio.
 *
 * El free tier alcanza para una cuenta que publica poco, pero devuelve 503
 * ("high demand") y 429 con bastante frecuencia, así que se reintenta con
 * espera creciente y se prueban modelos de respaldo.
 */

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * Alias, no versión fija: Google deja de servir los modelos viejos a las
 * cuentas nuevas —`gemini-2.5-flash` ya devuelve 404— y un alias sigue al
 * modelo vigente sin que haya que tocar el código.
 */
const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-flash-latest";
const FALLBACKS = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-flash-lite-latest"];
const REINTENTOS = 3;

export const geminiExtractor: ProductExtractor = {
  name: "gemini",

  isConfigured() {
    return Boolean(process.env.GEMINI_API_KEY?.trim());
  },

  missingConfig() {
    return process.env.GEMINI_API_KEY?.trim() ? [] : ["GEMINI_API_KEY"];
  },

  async extract(post: InstagramPost): Promise<ProductDraft> {
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) throw new Error("Falta GEMINI_API_KEY.");

    const parts: Record<string, unknown>[] = [];
    const imagenes = [];

    // Se mandan como mucho dos fotos: alcanzan para el texto alternativo y
    // mantienen la llamada liviana.
    for (const url of post.imageUrls.slice(0, 2)) {
      const image = await downloadImage(url);
      if (image) imagenes.push(image);
    }

    parts.push({ text: promptFor(post, imagenes.length) });
    for (const image of imagenes) {
      parts.push({ inline_data: { mime_type: image.mime, data: image.base64 } });
    }

    const response = await generate(
      key,
      JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: toGeminiSchema(SCHEMA),
        },
      }),
    );

    if (!response.ok) {
      const detalle = (await response.text()).slice(0, 160);
      throw new Error(
        response.status === 503
          ? "Gemini está saturado en este momento."
          : response.status === 429
            ? "Se agotó la cuota de Gemini por ahora."
            : `Gemini respondió ${response.status}: ${detalle}`,
      );
    }

    const payload = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini no devolvió contenido.");

    return toDraft(JSON.parse(text) as Record<string, unknown>, post);
  },
};

/** Reintenta con espera creciente y, si el modelo sigue caído, prueba otros. */
async function generate(key: string, body: string): Promise<Response> {
  const modelos = [MODEL, ...FALLBACKS.filter((m) => m !== MODEL)];
  let ultimo: Response | null = null;

  for (const modelo of modelos) {
    for (let intento = 1; intento <= REINTENTOS; intento++) {
      const response = await fetch(`${ENDPOINT}/${modelo}:generateContent`, {
        method: "POST",
        headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
        cache: "no-store",
        body,
      });

      if (response.ok) return response;
      ultimo = response;

      if (!esTransitorio(response.status)) break;
      if (intento < REINTENTOS) await esperar(1500 * intento);
    }
  }

  return ultimo!;
}
