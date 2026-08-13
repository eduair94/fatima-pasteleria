import type { CartItem } from "./types";

/**
 * El carrito vive en `localStorage` y ése es su único origen de verdad: React
 * lo lee con `useSyncExternalStore` en lugar de copiarlo a estado dentro de un
 * efecto. Así no hay parpadeo al hidratar y dos pestañas abiertas muestran el
 * mismo pedido.
 */

export const STORAGE_KEY = "fatima:pedido:v1";

const EMPTY: CartItem[] = [];

/** Cachés para que getSnapshot devuelva siempre la misma referencia. */
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

const listeners = new Set<() => void>();

function parse(raw: string | null): CartItem[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function getCartSnapshot(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Modo privado o almacenamiento bloqueado: el pedido queda en memoria.
    return cachedItems;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedItems = parse(raw);
  }
  return cachedItems;
}

export function getCartServerSnapshot(): CartItem[] {
  return EMPTY;
}

export function subscribeToCart(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function writeCart(items: CartItem[]): void {
  cachedItems = items;
  cachedRaw = JSON.stringify(items);
  try {
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // Sin almacenamiento el pedido sigue funcionando en esta pestaña.
  }
  for (const listener of listeners) listener();
}

/**
 * `false` en el servidor y `true` en el cliente, sin usar un efecto. Sirve para
 * no mostrar "tu pedido está vacío" antes de leer el almacenamiento.
 */
export const readySubscribe = () => () => {};
export const readyClient = () => true;
export const readyServer = () => false;
