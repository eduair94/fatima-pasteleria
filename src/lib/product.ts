import { formatPrice } from "./format";
import type { Product } from "./types";

/** Variantes con precio publicado. */
export function pricedVariants(product: Product) {
  return product.variants.filter((variant) => variant.price !== null);
}

export function hasPrice(product: Product): boolean {
  return pricedVariants(product).length > 0;
}

export function lowestPrice(product: Product): number | null {
  const prices = pricedVariants(product).map((variant) => variant.price!);
  return prices.length ? Math.min(...prices) : null;
}

/** "Desde $ 140" · "$ 1.200" · "6 por $ 100" · "Consultar". */
export function priceLabel(product: Product): string {
  const priced = pricedVariants(product);
  if (priced.length === 0) return "Consultar";

  if (priced.length === 1) {
    const [variant] = priced;
    const price = formatPrice(variant.price!);
    if (/^\d+\s+unidad/i.test(variant.label)) {
      return `${variant.label.replace(/\s*unidades?/i, "")} por ${price}`;
    }
    if (/unidad/i.test(variant.label)) return `${price} c/u`;
    return price;
  }

  return `Desde ${formatPrice(Math.min(...priced.map((v) => v.price!)))}`;
}

/** Variante que agrega el botón + de la tarjeta, sin abrir la ficha. */
export function defaultVariant(product: Product) {
  return pricedVariants(product)[0] ?? product.variants[0];
}

/** Descripción corta para meta description y JSON-LD. */
export function metaDescription(product: Product): string {
  const price = hasPrice(product) ? ` ${priceLabel(product)}.` : "";
  return `${product.summary}${price} Por encargo en Montevideo, con ${product.leadTimeHours} hs de anticipación. Envío o retiro, pedido por WhatsApp.`.slice(
    0,
    300,
  );
}
