"use client";

import { usePathname } from "next/navigation";

import { useCart } from "@/components/cart-provider";
import { Icon } from "@/components/icon";
import { formatPrice } from "@/lib/format";

/**
 * Barra fija de pedido. Existe sólo en mobile y sólo con el carrito cargado:
 * sin ítems no hay nada que resumir. En desktop el pedido se abre desde el
 * ícono del header.
 */
export function CartBar() {
  const { count, subtotal, open, ready } = useCart();
  const pathname = usePathname();

  const hidden =
    !ready || count === 0 || pathname.startsWith("/pedido") || pathname.startsWith("/admin");

  if (hidden) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-60 flex min-h-16 items-center gap-4 bg-brown-900 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-cream-50 shadow-[var(--shadow-bar)] md:hidden"
      role="region"
      aria-label="Resumen del pedido"
    >
      <Icon name="bag" size={22} className="text-gold-200" />
      <span className="flex flex-col leading-tight">
        <span className="text-xs uppercase" style={{ letterSpacing: "var(--tracking-caps)", color: "var(--gold-200)" }}>
          {count} {count === 1 ? "ítem" : "ítems"}
        </span>
        <span className="tnum text-[17px] font-semibold whitespace-nowrap">
          {formatPrice(subtotal)}
        </span>
      </span>
      <button type="button" onClick={open} className="fp-btn fp-btn--gold ml-auto">
        Ver pedido
      </button>
    </div>
  );
}
