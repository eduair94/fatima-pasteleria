"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { Icon } from "@/components/icon";
import { formatDateLong, formatPrice } from "@/lib/format";
import {
  getOrderSummaryServerSnapshot,
  getOrderSummarySnapshot,
  subscribeToOrderSummary,
} from "@/lib/order-summary";
import { SITE } from "@/lib/site";
import { itemTotal, zoneById } from "@/lib/whatsapp";

export function OrderConfirmation() {
  const summary = useSyncExternalStore(
    subscribeToOrderSummary,
    getOrderSummarySnapshot,
    getOrderSummaryServerSnapshot,
  );

  const steps = [
    "Fátima te responde por WhatsApp y confirma disponibilidad.",
    "Coordinan la hora de entrega y la forma de pago.",
    summary
      ? `El pedido se entrega el ${formatDateLong(summary.details.date)}, a partir de las ${summary.settings.deliveryFromHour} h.`
      : "El pedido se entrega en la fecha acordada, a partir de las 19 h.",
  ];

  return (
    <div className="wrap flex max-w-[720px] flex-col gap-8 py-14 pb-24">
      <header className="flex flex-col items-center gap-3 text-center">
        <Icon name="check-circle" size={34} className="text-green-700" />
        <h1 className="t-h1">Pedido enviado</h1>
        <p className="max-w-[34rem] leading-relaxed text-brown-700">
          Se abrió WhatsApp con el detalle. Fátima confirma disponibilidad y la entrega por ese chat.
          Si no se abrió solo, escribile al {SITE.whatsapp.display}.
        </p>
        {summary ? (
          <span className="fp-badge fp-badge--neutral mt-1">Referencia {summary.reference}</span>
        ) : null}
      </header>

      {summary ? (
        <section className="fp-card flex flex-col gap-3 p-6" aria-labelledby="titulo-resumen">
          <h2 id="titulo-resumen" className="eyebrow">
            Resumen
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {summary.items.map((item) => (
              <li key={item.key} className="flex justify-between gap-4 text-sm text-brown-700">
                <span>
                  {item.quantity} × {item.name}
                  {item.variantLabel ? ` (${item.variantLabel.toLowerCase()})` : ""}
                </span>
                <span className="tnum">{formatPrice(itemTotal(item))}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 border-t border-line-200 pt-3">
            <div className="flex justify-between text-sm text-brown-700">
              <span>Subtotal</span>
              <span className="tnum">{formatPrice(summary.totals.subtotal)}</span>
            </div>
            {summary.details.mode === "envio" ? (
              <div className="flex justify-between text-sm text-brown-700">
                <span>Envío · {zoneById(summary.details.zoneId)?.name}</span>
                <span className="tnum">
                  {summary.totals.shipping === null
                    ? "A coordinar"
                    : formatPrice(summary.totals.shipping)}
                </span>
              </div>
            ) : (
              <div className="flex justify-between text-sm text-brown-700">
                <span>Retiro</span>
                <span>Sin costo</span>
              </div>
            )}
            <div className="flex justify-between border-t border-line-200 pt-3 text-[17px] font-semibold">
              <span>Total</span>
              <span className="tnum">
                {formatPrice(summary.totals.total)}
                {summary.totals.totalPending ? " + envío" : ""}
              </span>
            </div>
            <div className="flex justify-between border-t border-line-200 pt-3 text-sm text-brown-500">
              <span>Entrega</span>
              <span>
                {formatDateLong(summary.details.date)}, desde las {summary.settings.deliveryFromHour} h
              </span>
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="titulo-pasos" className="flex flex-col gap-4">
        <h2 id="titulo-pasos" className="eyebrow">
          Próximos pasos
        </h2>
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-300 text-xs font-semibold">
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed text-brown-700">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/catalogo" className="fp-btn fp-btn--ghost fp-btn--block sm:w-auto!">
          Volver al catálogo
        </Link>
        <a
          href={SITE.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="fp-btn fp-btn--ghost fp-btn--block sm:w-auto!"
        >
          <Icon name="instagram" size={18} />
          Seguir a {SITE.instagram.handle}
        </a>
      </div>
    </div>
  );
}
