import type { InstagramPost } from "./instagram";
import { slugify } from "./format";
import { CATEGORIES } from "./site";
import type { Product } from "./types";

/**
 * Lee una publicación de Instagram y devuelve un borrador de producto.
 *
 * Se usa la API REST de Gemini directo, sin SDK: es una sola llamada y así no
 * entra otra dependencia. El free tier de AI Studio da unas 1.500 llamadas por
 * día; la cuenta publica menos de diez por mes.
 *
 * Dos reglas que el prompt impone y el código vuelve a verificar:
 *
 *   1. **Los precios no se inventan.** Si la caption no dice un número, el
 *      precio queda en null y el producto sale como "Consultar".
 *   2. **El texto alternativo describe la foto, no el producto.** Es lo que
 *      pide el sistema de diseño y lo más tedioso de escribir a mano.
 */

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

export function geminiIsConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

const SCHEMA = {
  type: "OBJECT",
  properties: {
    esProducto: {
      type: "BOOLEAN",
      description:
        "true sólo si la publicación ofrece algo a la venta. false para fotos de proceso, avisos o saludos.",
    },
    name: { type: "STRING", description: "Nombre del producto, sin emoji ni precio." },
    category: { type: "STRING", enum: CATEGORIES.map((c) => c.id) },
    summary: { type: "STRING", description: "Una línea de máximo 140 caracteres." },
    description: {
      type: "STRING",
      description:
        "Dos o tres frases redactadas de nuevo a partir de los hechos de la caption. No copiar la caption.",
    },
    badge: {
      type: "STRING",
      description: "Etiqueta corta si la caption habla de cantidad limitada. Vacío si no.",
    },
    variants: {
      type: "ARRAY",
      description:
        "Una opción de compra por cada precio que diga la caption. Si no dice ninguno, una sola opción con price null.",
      items: {
        type: "OBJECT",
        properties: {
          label: { type: "STRING", description: "Entero, Porción, 6 unidades, Por unidad…" },
          price: {
            type: "NUMBER",
            nullable: true,
            description: "Sólo si la caption dice el número. Nunca estimar.",
          },
          detail: { type: "STRING", description: "Aclaración corta, o vacío." },
        },
        required: ["label"],
      },
    },
    altTexts: {
      type: "ARRAY",
      description:
        "Un texto alternativo por foto recibida, en el mismo orden. Describe lo que se ve en la imagen: el producto, cómo está servido y sobre qué. Nunca 'foto de producto'.",
      items: { type: "STRING" },
    },
    warnings: {
      type: "ARRAY",
      description: "Qué conviene revisar a mano antes de publicar. Vacío si está todo claro.",
      items: { type: "STRING" },
    },
  },
  required: ["esProducto", "name", "category", "summary", "variants", "altTexts", "warnings"],
} as const;

const INSTRUCCIONES = `Sos quien carga el catálogo de una pastelería casera de Montevideo, Uruguay.
A partir de una publicación de Instagram armás la ficha del producto.

Reglas que no se rompen:
- Los precios salen ÚNICAMENTE de números que estén escritos en la caption. Si no hay número, price es null. Nunca estimes ni compares con otros productos.
- "$1200" significa 1200 pesos uruguayos. Devolvé el número pelado, sin símbolo ni puntos.
- "6 por $100" es UNA opción: label "6 unidades", price 100. "$30 cada uno" es label "Por unidad", price 30.
- Si la caption da precio de entero y de porción, son DOS opciones.
- Escribí en español rioplatense, de vos, en primera persona del singular.
- Sin emoji, sin signos de exclamación y sin diminutivos en los textos de la ficha.
- La descripción se redacta de nuevo con los hechos de la caption; no se copia la caption.
- Los textos alternativos describen lo que realmente se ve en cada foto.
- Si la publicación no vende nada (proceso, aviso, agradecimiento), esProducto es false y el resto puede ir vacío.
- Ante cualquier duda sobre un precio o una cantidad, dejalo en null y explicá la duda en warnings.`;

export type ProductDraft = {
  draft: Partial<Product>;
  warnings: string[];
  isProduct: boolean;
};

type GeminiPart = { text: string } | { inline_data: { mime_type: string; data: string } };

export async function draftProductFromPost(post: InstagramPost): Promise<ProductDraft> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("Falta GEMINI_API_KEY.");

  const parts: GeminiPart[] = [
    {
      text: `${INSTRUCCIONES}\n\nCaption de la publicación:\n"""\n${post.caption || "(sin texto)"}\n"""\n\nFotos adjuntas: ${post.imageUrls.length}.`,
    },
  ];

  // Se mandan como mucho dos fotos: alcanzan para el texto alternativo y
  // mantienen la llamada liviana.
  for (const url of post.imageUrls.slice(0, 2)) {
    const image = await downloadAsInlineData(url);
    if (image) parts.push({ inline_data: image });
  }

  const response = await fetch(`${ENDPOINT}/${MODEL}:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: SCHEMA,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini respondió ${response.status}: ${(await response.text()).slice(0, 200)}`);
  }

  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini no devolvió contenido.");

  return toDraft(JSON.parse(text) as Record<string, unknown>, post);
}

async function downloadAsInlineData(url: string) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;

    const type = response.headers.get("content-type") ?? "image/jpeg";
    if (!type.startsWith("image/")) return null;

    const buffer = await response.arrayBuffer();
    // Más de 4 MB no aporta para describir una foto y engorda la llamada.
    if (buffer.byteLength > 4 * 1024 * 1024) return null;

    return { mime_type: type, data: Buffer.from(buffer).toString("base64") };
  } catch {
    return null;
  }
}

/** Pasa la salida del modelo a la forma del catálogo, revisándola de nuevo. */
function toDraft(raw: Record<string, unknown>, post: InstagramPost): ProductDraft {
  const warnings = Array.isArray(raw.warnings) ? raw.warnings.map(String) : [];
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const category = CATEGORIES.some((c) => c.id === raw.category) ? String(raw.category) : "tortas";

  const rawVariants = Array.isArray(raw.variants) ? raw.variants : [];
  const variants = rawVariants
    .map((entry, index) => {
      const item = entry as Record<string, unknown>;
      const label = typeof item.label === "string" ? item.label.trim() : "";
      if (!label) return null;

      // El precio se acepta sólo si el número aparece en la caption. Es la
      // última defensa contra un valor inventado.
      const price =
        typeof item.price === "number" && Number.isFinite(item.price) && item.price > 0
          ? Math.round(item.price)
          : null;

      if (price !== null && !captionMentions(post.caption, price)) {
        warnings.push(`El precio ${price} de "${label}" no aparece en el texto. Se dejó en blanco.`);
        return { id: slugify(label) || `opcion-${index + 1}`, label, price: null };
      }

      return {
        id: slugify(label) || `opcion-${index + 1}`,
        label,
        price,
        detail: typeof item.detail === "string" && item.detail.trim() ? item.detail.trim() : undefined,
      };
    })
    .filter((variant): variant is NonNullable<typeof variant> => variant !== null);

  const altTexts = Array.isArray(raw.altTexts) ? raw.altTexts.map(String) : [];

  if (variants.every((variant) => variant.price === null)) {
    warnings.push("No se detectó ningún precio: se va a mostrar como Consultar.");
  }

  return {
    isProduct: raw.esProducto !== false,
    warnings,
    draft: {
      name,
      slug: slugify(name),
      category,
      summary: typeof raw.summary === "string" ? raw.summary.trim() : "",
      description: typeof raw.description === "string" ? raw.description.trim() : "",
      badge: typeof raw.badge === "string" && raw.badge.trim() ? raw.badge.trim() : undefined,
      variants: variants.length ? variants : [{ id: "consultar", label: "A coordinar", price: null }],
      images: post.imageUrls.slice(0, 3).map((src, index) => ({
        src,
        alt: altTexts[index]?.trim() || "",
      })),
      leadTimeHours: 48,
      available: true,
      stock: null,
      order: 99,
      instagramUrl: post.url,
    },
  };
}

/**
 * ¿El número está escrito en la caption? Se prueban las formas en que la
 * cuenta escribe los precios: 1200, 1.200, 1 200.
 */
function captionMentions(caption: string, price: number): boolean {
  const plain = String(price);
  const grouped = price.toLocaleString("es-UY");
  const normalized = caption.replace(/\s/g, "");
  return (
    normalized.includes(plain) ||
    normalized.includes(grouped.replace(/\s/g, "")) ||
    normalized.includes(grouped.replace(/\./g, ""))
  );
}
