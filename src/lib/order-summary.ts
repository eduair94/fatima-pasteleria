import type { CartItem, OrderDetails, Settings } from "./types";
import type { OrderTotals } from "./whatsapp";

/**
 * Resumen del pedido recién enviado. Vive en `sessionStorage` sólo para pintar
 * la pantalla de confirmación: se pierde al cerrar la pestaña y nunca sale del
 * navegador.
 */

const KEY = "fatima:pedido-enviado:v1";

export type OrderSummary = {
  items: CartItem[];
  details: OrderDetails;
  totals: OrderTotals;
  reference: string;
  settings: Settings;
};

let cachedRaw: string | null = null;
let cachedSummary: OrderSummary | null = null;

export function saveOrderSummary(summary: OrderSummary): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(summary));
  } catch {
    // Sin sessionStorage la confirmación se muestra en su versión sin detalle.
  }
}

export function getOrderSummarySnapshot(): OrderSummary | null {
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(KEY);
  } catch {
    return cachedSummary;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedSummary = raw ? (JSON.parse(raw) as OrderSummary) : null;
    } catch {
      cachedSummary = null;
    }
  }
  return cachedSummary;
}

export function getOrderSummaryServerSnapshot(): OrderSummary | null {
  return null;
}

export const subscribeToOrderSummary = () => () => {};
