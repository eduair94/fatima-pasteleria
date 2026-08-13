"use client";

import { useCart } from "@/components/cart-provider";
import { Icon } from "@/components/icon";
import { defaultVariant, hasPrice, isSoldOut } from "@/lib/product";
import type { Product } from "@/lib/types";
import { buildProductInquiry, waLink } from "@/lib/whatsapp";

/**
 * Botón + de la tarjeta: agrega la variante por defecto sin abrir la ficha.
 * Si el producto no tiene precio publicado, en su lugar abre WhatsApp para
 * consultar. No se le inventa un precio.
 */
export function AddButton({ product }: { product: Product }) {
  const { add, settings } = useCart();

  if (!product.available || isSoldOut(product)) {
    return (
      <a
        href={waLink(settings.whatsappE164, buildProductInquiry(product.name))}
        target="_blank"
        rel="noopener noreferrer"
        className="fp-btn fp-btn--ghost fp-btn--sm"
      >
        <Icon name="whatsapp" size={14} />
        Avisame
      </a>
    );
  }

  if (!hasPrice(product)) {
    return (
      <a
        href={waLink(settings.whatsappE164, buildProductInquiry(product.name))}
        target="_blank"
        rel="noopener noreferrer"
        className="fp-iconbtn fp-iconbtn--sm fp-iconbtn--outline"
        aria-label={`Consultar por ${product.name} en WhatsApp`}
      >
        <Icon name="whatsapp" size={16} />
      </a>
    );
  }

  return (
    <button
      type="button"
      className="fp-iconbtn fp-iconbtn--sm fp-iconbtn--outline"
      onClick={() => add(product, defaultVariant(product))}
      aria-label={`Agregar ${product.name} al pedido`}
    >
      <Icon name="plus" size={18} />
    </button>
  );
}
