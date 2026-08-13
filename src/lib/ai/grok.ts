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
} from "./contract";

/**
 * Grok, de xAI. La API es compatible con la de OpenAI, así que se usa
 * `chat/completions` con `response_format: json_schema`.
 *
 * xAI **no tiene free tier permanente**: hay que comprar créditos o activar
 * el programa de datos compartidos en la consola (Settings → Data Sharing),
 * que da crédito mensual a cambio de que usen las llamadas para entrenar. Sin
 * ninguna de las dos cosas, la API devuelve 403 con "doesn't have any credits".
 */

const ENDPOINT = "https://api.x.ai/v1/chat/completions";
const MODEL = process.env.GROK_MODEL?.trim() || "grok-4-fast";
const REINTENTOS = 3;

export const grokExtractor: ProductExtractor = {
  name: "grok",

  isConfigured() {
    return Boolean(process.env.XAI_API_KEY?.trim());
  },

  missingConfig() {
    return process.env.XAI_API_KEY?.trim() ? [] : ["XAI_API_KEY"];
  },

  async extract(post: InstagramPost): Promise<ProductDraft> {
    const key = process.env.XAI_API_KEY?.trim();
    if (!key) throw new Error("Falta XAI_API_KEY.");

    // Se mandan como mucho dos fotos: alcanzan para el texto alternativo y
    // mantienen la llamada liviana.
    const imagenes = [];
    for (const url of post.imageUrls.slice(0, 2)) {
      const image = await downloadImage(url);
      if (image) imagenes.push(image);
    }

    // Si el modelo elegido no acepta imágenes, se reintenta sin ellas: se
    // pierden los textos alternativos, no la ficha entera.
    let respuesta = await pedir(key, post, imagenes);
    if (!respuesta.ok && imagenes.length && (await esErrorDeModalidad(respuesta))) {
      respuesta = await pedir(key, post, []);
    }

    if (!respuesta.ok) {
      const detalle = (await respuesta.text()).slice(0, 200);
      if (respuesta.status === 403 && /credit|license/i.test(detalle)) {
        throw new Error(
          "La cuenta de xAI no tiene créditos. Activá el programa de datos compartidos en console.x.ai o cargá crédito.",
        );
      }
      throw new Error(`Grok respondió ${respuesta.status}: ${detalle}`);
    }

    const payload = (await respuesta.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = payload.choices?.[0]?.message?.content;
    if (!text) throw new Error("Grok no devolvió contenido.");

    return toDraft(JSON.parse(text) as Record<string, unknown>, post);
  },
};

async function pedir(
  key: string,
  post: InstagramPost,
  imagenes: { mime: string; base64: string }[],
): Promise<Response> {
  const content: Record<string, unknown>[] = [
    { type: "text", text: promptFor(post, imagenes.length) },
    ...imagenes.map((image) => ({
      type: "image_url",
      image_url: { url: `data:${image.mime};base64,${image.base64}`, detail: "high" },
    })),
  ];

  const body = JSON.stringify({
    model: MODEL,
    temperature: 0.2,
    messages: [{ role: "user", content }],
    response_format: {
      type: "json_schema",
      json_schema: { name: "ficha_de_producto", strict: true, schema: SCHEMA },
    },
  });

  let ultimo: Response | null = null;

  for (let intento = 1; intento <= REINTENTOS; intento++) {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      cache: "no-store",
      body,
    });

    if (response.ok) return response;
    ultimo = response;

    if (!esTransitorio(response.status)) break;
    if (intento < REINTENTOS) await esperar(1500 * intento);
  }

  return ultimo!;
}

/** ¿El error es porque el modelo no acepta imágenes? */
async function esErrorDeModalidad(response: Response): Promise<boolean> {
  if (response.status !== 400 && response.status !== 422) return false;
  const texto = (await response.clone().text()).toLowerCase();
  return /image|modality|vision|multimodal/.test(texto);
}
