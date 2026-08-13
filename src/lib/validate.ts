import { slugify } from "./format";
import { CATEGORIES } from "./site";
import type { Product, Settings, Variant } from "./types";

/**
 * Validación de lo que entra por la API de administración. Sin dependencias:
 * el esquema es chico y explícito, y así el error que ve el usuario está en
 * español y dice qué campo arreglar.
 */

export class ValidationError extends Error {
  constructor(
    message: string,
    readonly field?: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

function str(value: unknown, field: string, { required = true, max = 2000 } = {}): string {
  if (value === undefined || value === null) {
    if (required) throw new ValidationError(`Falta ${field}.`, field);
    return "";
  }
  if (typeof value !== "string") throw new ValidationError(`${field} tiene que ser texto.`, field);
  const trimmed = value.trim();
  if (required && !trimmed) throw new ValidationError(`${field} no puede quedar vacío.`, field);
  if (trimmed.length > max) throw new ValidationError(`${field} es demasiado largo.`, field);
  return trimmed;
}

function priceOrNull(value: unknown, field: string): number | null {
  if (value === null || value === "" || value === undefined) return null;
  const num = typeof value === "number" ? value : Number(String(value).replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num)) throw new ValidationError(`${field} tiene que ser un número.`, field);
  if (num < 0) throw new ValidationError(`${field} no puede ser negativo.`, field);
  if (num > 1_000_000) throw new ValidationError(`${field} es demasiado alto.`, field);
  return Math.round(num);
}

function int(value: unknown, field: string, fallback: number): number {
  if (value === undefined || value === null || value === "") return fallback;
  const num = Number(value);
  if (!Number.isFinite(num)) throw new ValidationError(`${field} tiene que ser un número.`, field);
  return Math.round(num);
}

function bool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function parseVariants(value: unknown): Variant[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ValidationError("El producto necesita al menos una opción de compra.", "variants");
  }
  if (value.length > 8) {
    throw new ValidationError("Como máximo 8 opciones por producto.", "variants");
  }
  return value.map((raw, index) => {
    const item = raw as Record<string, unknown>;
    const label = str(item.label, `la etiqueta de la opción ${index + 1}`, { max: 60 });
    return {
      id: (typeof item.id === "string" && item.id.trim()) || slugify(label) || `opcion-${index + 1}`,
      label,
      price: priceOrNull(item.price, `el precio de "${label}"`),
      detail: str(item.detail, "el detalle", { required: false, max: 80 }) || undefined,
    };
  });
}

function parseImages(value: unknown): { src: string; alt: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, 6)
    .map((raw) => {
      const item = raw as Record<string, unknown>;
      const src = str(item.src, "la URL de la foto", { required: false, max: 500 });
      if (!src) return null;
      if (!/^(\/|https:\/\/)/.test(src)) {
        throw new ValidationError("La foto tiene que empezar con / o con https://", "images");
      }
      return {
        src,
        alt: str(item.alt, "el texto alternativo", { required: false, max: 300 }),
      };
    })
    .filter((item): item is { src: string; alt: string } => item !== null);
}

export function parseProduct(input: unknown, existing?: Product): Product {
  const body = (input ?? {}) as Record<string, unknown>;
  const name = str(body.name, "el nombre", { max: 120 });
  const category = str(body.category, "la categoría", { max: 40 });

  if (!CATEGORIES.some((c) => c.id === category)) {
    throw new ValidationError(
      `Categoría desconocida. Usá una de: ${CATEGORIES.map((c) => c.id).join(", ")}.`,
      "category",
    );
  }

  const slug = slugify(str(body.slug, "la dirección web", { required: false, max: 120 }) || name);
  if (!slug) throw new ValidationError("No se pudo armar la dirección web.", "slug");

  return {
    id: existing?.id ?? ((typeof body.id === "string" && body.id.trim()) || slug),
    slug,
    name,
    category,
    summary: str(body.summary, "el resumen", { max: 200 }),
    description: str(body.description, "la descripción", { required: false, max: 1200 }),
    images: parseImages(body.images),
    variants: parseVariants(body.variants),
    leadTimeHours: int(body.leadTimeHours, "la anticipación", existing?.leadTimeHours ?? 48),
    available: bool(body.available, existing?.available ?? true),
    badge: str(body.badge, "la etiqueta", { required: false, max: 40 }) || undefined,
    featured: bool(body.featured, existing?.featured ?? false),
    order: int(body.order, "el orden", existing?.order ?? 99),
    instagramUrl:
      str(body.instagramUrl, "el enlace de Instagram", { required: false, max: 300 }) || undefined,
    updatedAt: new Date().toISOString(),
  };
}

export function parseSettings(input: unknown, existing: Settings): Settings {
  const body = (input ?? {}) as Record<string, unknown>;
  const shippingCost = priceOrNull(body.shippingCost, "el costo de envío");
  const whatsappE164 = str(body.whatsappE164, "el WhatsApp", { max: 20 }).replace(/\D/g, "");

  if (whatsappE164.length < 8) {
    throw new ValidationError("El WhatsApp tiene que ir en formato internacional, sin signos.", "whatsappE164");
  }

  const leadTimeHours = int(body.leadTimeHours, "la anticipación", existing.leadTimeHours);
  if (leadTimeHours < 0 || leadTimeHours > 24 * 30) {
    throw new ValidationError("La anticipación tiene que estar entre 0 y 720 horas.", "leadTimeHours");
  }

  const deliveryFromHour = int(body.deliveryFromHour, "la hora de entrega", existing.deliveryFromHour);
  if (deliveryFromHour < 0 || deliveryFromHour > 23) {
    throw new ValidationError("La hora de entrega tiene que estar entre 0 y 23.", "deliveryFromHour");
  }

  return {
    shippingCost: shippingCost ?? existing.shippingCost,
    leadTimeHours,
    deliveryFromHour,
    whatsappE164,
    whatsappDisplay: str(body.whatsappDisplay, "el WhatsApp visible", { max: 30 }),
    announcement: str(body.announcement, "el aviso", { required: false, max: 200 }),
    updatedAt: new Date().toISOString(),
  };
}
