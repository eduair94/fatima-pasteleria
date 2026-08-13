import { formatDateLong, formatPhone, formatPrice } from "./format";
import { ZONES } from "./site";
import type { CartItem, OrderDetails, Settings } from "./types";

/**
 * El cierre del pedido es un link `wa.me` con el mensaje ya redactado. Es el
 * único dato que sale del sitio: no hay servidor de pedidos ni pasarela de pago.
 *
 * El orden de los bloques es fijo y viene del wireframe (estado E4):
 * encabezado, datos, ítems, subtotal, envío, total, fecha, modalidad,
 * dirección, comentarios, referencia.
 */

export function waLink(phoneE164: string, message: string): string {
  return `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;
}

/** Link de consulta suelta, sin pedido armado. */
export function waConsultLink(phoneE164: string, subject?: string): string {
  const message = subject
    ? `Hola Fátima, quería consultarte por ${subject}.`
    : "Hola Fátima, quería hacerte una consulta.";
  return waLink(phoneE164, message);
}

export function itemTotal(item: CartItem): number {
  return item.unitPrice * item.quantity;
}

export function subtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + itemTotal(item), 0);
}

/** Anticipación del pedido: la fija el ítem de mayor plazo. */
export function maxLeadTimeHours(items: CartItem[], fallback: number): number {
  return items.reduce((max, item) => Math.max(max, item.leadTimeHours), fallback);
}

export function zoneById(id?: string) {
  return ZONES.find((z) => z.id === id);
}

export function shippingFor(details: OrderDetails, settings: Settings): number | null {
  if (details.mode !== "envio") return 0;
  const zone = zoneById(details.zoneId);
  if (!zone) return null;
  return zone.cost === null ? null : settings.shippingCost;
}

export type OrderTotals = {
  subtotal: number;
  /** null = envío a coordinar, todavía no se puede sumar. */
  shipping: number | null;
  total: number;
  totalPending: boolean;
};

export function orderTotals(
  items: CartItem[],
  details: OrderDetails,
  settings: Settings,
): OrderTotals {
  const sub = subtotal(items);
  const shipping = shippingFor(details, settings);
  return {
    subtotal: sub,
    shipping,
    total: sub + (shipping ?? 0),
    totalPending: shipping === null,
  };
}

export function buildOrderMessage(
  items: CartItem[],
  details: OrderDetails,
  settings: Settings,
  reference: string,
): string {
  const totals = orderTotals(items, details, settings);
  const zone = zoneById(details.zoneId);
  const lines: string[] = ["Hola Fátima, quiero hacer un pedido.", ""];

  lines.push(`Nombre: ${details.name.trim()}`);
  // El teléfono es opcional: el mensaje llega por WhatsApp, así que el número
  // ya viene con el chat. Sólo se agrega si dejaron uno distinto.
  if (details.phone.trim()) lines.push(`Teléfono: ${formatPhone(details.phone)}`);
  lines.push("", "Pedido:");

  for (const item of items) {
    const parts = [`· ${item.quantity} x ${item.name}`];
    if (item.variantLabel) parts.push(`(${item.variantLabel.toLowerCase()})`);
    let line = parts.join(" ");
    if (item.note?.trim()) line += ` — ${item.note.trim()}`;
    line += ` — ${formatPrice(itemTotal(item))}`;
    lines.push(line);
  }

  lines.push("", `Subtotal: ${formatPrice(totals.subtotal)}`);

  if (details.mode === "envio") {
    if (totals.shipping === null) {
      lines.push(`Envío (${zone?.name ?? "a coordinar"}): a coordinar`);
      lines.push(`Total: ${formatPrice(totals.subtotal)} + envío`);
    } else {
      lines.push(`Envío (${zone?.name}): ${formatPrice(totals.shipping)}`);
      lines.push(`Total: ${formatPrice(totals.total)}`);
    }
  } else {
    lines.push(`Total: ${formatPrice(totals.total)}`);
  }

  lines.push("", `Fecha de entrega: ${formatDateLong(details.date)}`);
  lines.push(`Modalidad: ${details.mode === "envio" ? "Envío" : "Retiro"}`);

  if (details.mode === "envio") {
    const address = [details.address?.trim()];
    if (details.apartment?.trim()) address.push(`apto ${details.apartment.trim()}`);
    let addressLine = address.filter(Boolean).join(", ");
    if (zone?.name) addressLine += ` (${zone.name})`;
    lines.push(`Dirección: ${addressLine}`);
    if (details.reference?.trim()) lines.push(`Referencia: ${details.reference.trim()}`);
  } else {
    lines.push(`Retiro: ${settings.deliveryFromHour} h en adelante, a coordinar`);
  }

  if (details.comments?.trim()) lines.push(`Comentarios: ${details.comments.trim()}`);

  lines.push("", `Pedido ${reference}`);

  return lines.join("\n");
}

/** Consulta por un producto sin precio publicado. */
export function buildProductInquiry(productName: string): string {
  return `Hola Fátima, quería consultarte por ${productName}: precio y disponibilidad.`;
}
