import { slugify } from "../format";
import type { InstagramPost } from "../instagram";
import { CATEGORIES } from "../site";
import type { Product } from "../types";

/**
 * Lo que se le pide al modelo, una sola vez para todos los proveedores.
 *
 * El esquema se escribe en JSON Schema estándar; cada proveedor lo adapta a su
 * dialecto. Así el prompt y la forma de la respuesta no se van separando entre
 * un modelo y otro.
 */

export type ProductDraft = {
  draft: Partial<Product>;
  warnings: string[];
  isProduct: boolean;
};

export interface ProductExtractor {
  readonly name: string;
  isConfigured(): boolean;
  missingConfig(): string[];
  extract(post: InstagramPost): Promise<ProductDraft>;
}

export const SCHEMA = {
  type: "object",
  properties: {
    esProducto: {
      type: "boolean",
      description:
        "true sólo si la publicación ofrece algo a la venta. false para fotos de proceso, avisos o saludos.",
    },
    name: { type: "string", description: "Nombre del producto, sin emoji ni precio." },
    category: { type: "string", enum: CATEGORIES.map((c) => c.id) },
    summary: { type: "string", description: "Una línea de máximo 140 caracteres." },
    description: {
      type: "string",
      description:
        "Dos o tres frases redactadas de nuevo a partir de los hechos de la caption. No copiar la caption.",
    },
    badge: {
      type: "string",
      description: "Etiqueta corta si la caption habla de cantidad limitada. Vacío si no.",
    },
    variants: {
      type: "array",
      description:
        "Una opción de compra por cada precio que diga la caption. Si no dice ninguno, una sola opción con price null.",
      items: {
        type: "object",
        properties: {
          label: { type: "string", description: "Entero, Porción, 6 unidades, Por unidad…" },
          price: {
            type: ["number", "null"],
            description: "Sólo si la caption dice el número. Nunca estimar.",
          },
          detail: { type: "string", description: "Aclaración corta, o vacío." },
        },
        required: ["label", "price", "detail"],
        additionalProperties: false,
      },
    },
    altTexts: {
      type: "array",
      description:
        "Un texto alternativo por foto recibida, en el mismo orden. Describe lo que se ve en la imagen: el producto, cómo está servido y sobre qué. Nunca 'foto de producto'.",
      items: { type: "string" },
    },
    warnings: {
      type: "array",
      description: "Qué conviene revisar a mano antes de publicar. Vacío si está todo claro.",
      items: { type: "string" },
    },
  },
  required: [
    "esProducto",
    "name",
    "category",
    "summary",
    "description",
    "badge",
    "variants",
    "altTexts",
    "warnings",
  ],
  additionalProperties: false,
} as const;

export const INSTRUCCIONES = `Sos quien carga el catálogo de una pastelería casera de Montevideo, Uruguay.
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

export function promptFor(post: InstagramPost, fotos: number): string {
  return `${INSTRUCCIONES}\n\nCaption de la publicación:\n"""\n${
    post.caption || "(sin texto)"
  }\n"""\n\nFotos adjuntas: ${fotos}.`;
}

/**
 * Gemini usa el subconjunto de OpenAPI, con los tipos en mayúsculas y sin
 * `additionalProperties` ni tipos en unión. Se convierte desde el esquema
 * estándar para no mantener dos.
 */
export function toGeminiSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(toGeminiSchema);
  if (!schema || typeof schema !== "object") return schema;

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema as Record<string, unknown>)) {
    if (key === "additionalProperties") continue;

    if (key === "type") {
      if (Array.isArray(value)) {
        // ["number","null"] → NUMBER nullable
        const real = value.find((t) => t !== "null");
        out.type = String(real).toUpperCase();
        if (value.includes("null")) out.nullable = true;
      } else {
        out.type = String(value).toUpperCase();
      }
      continue;
    }

    out[key] = toGeminiSchema(value);
  }
  return out;
}

/** Pasa la salida del modelo a la forma del catálogo, revisándola de nuevo. */
export function toDraft(raw: Record<string, unknown>, post: InstagramPost): ProductDraft {
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
      // última defensa contra un valor inventado, y vale para cualquier modelo.
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

/** Baja una foto y la deja lista para mandar al modelo. */
export async function downloadImage(
  url: string,
): Promise<{ mime: string; base64: string } | null> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;

    const mime = response.headers.get("content-type") ?? "image/jpeg";
    if (!mime.startsWith("image/")) return null;

    const buffer = await response.arrayBuffer();
    // Más de 4 MB no aporta para describir una foto y engorda la llamada.
    if (buffer.byteLength > 4 * 1024 * 1024) return null;

    return { mime, base64: Buffer.from(buffer).toString("base64") };
  } catch {
    return null;
  }
}

/** 429 y 5xx son transitorios; el resto no mejora reintentando. */
export function esTransitorio(status: number): boolean {
  return status === 429 || status >= 500;
}

export const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
