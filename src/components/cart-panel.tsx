"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { Icon } from "@/components/icon";
import { QuantityStepper } from "@/components/quantity-stepper";
import { firstAvailableDate, formatDateShort, formatPrice } from "@/lib/format";
import { itemTotal } from "@/lib/whatsapp";

export function CartPanel() {
  const { items, isOpen, close, setQuantity, setNote, remove, subtotal, leadTimeHours } = useCart();
  const [editing, setEditing] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) sheetRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const firstDate = firstAvailableDate(leadTimeHours);

  return (
    <div className="fixed inset-0 z-80 flex items-end justify-center md:items-center">
      <button
        type="button"
        className="anim-fade absolute inset-0 cursor-default border-0"
        style={{ background: "var(--surface-scrim)" }}
        onClick={close}
        aria-label="Cerrar el pedido"
      />

      <div
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-pedido"
        className="anim-rise relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[26px] bg-cream-50 shadow-[var(--shadow-modal)] outline-none md:max-h-[88vh] md:max-w-[620px] md:rounded-[26px]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line-200 px-5 py-4">
          <h2 id="titulo-pedido" className="t-h2">
            Tu pedido
          </h2>
          <button type="button" className="fp-iconbtn" onClick={close} aria-label="Cerrar">
            <Icon name="x" size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
            <Icon name="bag" size={26} className="text-brown-300" />
            <p className="t-h3">Todavía no agregaste nada</p>
            <p className="max-w-[24rem] text-sm leading-relaxed text-brown-500">
              Elegí del catálogo y armá tu pedido. Se coordina por WhatsApp con {leadTimeHours} hs de
              anticipación.
            </p>
            <Link
              href="/catalogo"
              onClick={close}
              className="fp-btn fp-btn--primary fp-btn--lg fp-btn--block mt-2"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="m-0 list-none p-0">
                {items.map((item) => (
                  <li
                    key={item.key}
                    className="grid grid-cols-[64px_1fr_auto] gap-4 border-b border-line-200 py-4"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-cream-300">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex min-w-0 flex-col gap-1">
                      <Link
                        href={`/producto/${item.slug}`}
                        onClick={close}
                        className="t-quote text-brown-900 no-underline hover:text-berry-700"
                      >
                        {item.name}
                      </Link>
                      {item.variantLabel ? (
                        <span className="text-sm text-brown-500">{item.variantLabel}</span>
                      ) : null}

                      {editing === item.key ? (
                        <div className="mt-1 flex flex-col gap-2">
                          <label className="fp-help" htmlFor={`nota-${item.key}`}>
                            Nota para este ítem
                          </label>
                          <textarea
                            id={`nota-${item.key}`}
                            className="fp-input min-h-[72px]! text-sm"
                            defaultValue={item.note ?? ""}
                            placeholder="Dedicatoria, sin azúcar, alergias"
                            maxLength={200}
                            onBlur={(event) => {
                              setNote(item.key, event.target.value);
                              setEditing(null);
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <>
                          {item.note ? (
                            <span className="text-sm text-brown-500">Nota: {item.note}</span>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setEditing(item.key)}
                            className="mt-1 cursor-pointer self-start border-0 bg-transparent p-0 text-sm text-berry-700 underline underline-offset-2 hover:text-brown-900"
                          >
                            {item.note ? "Editar nota" : "Agregar nota"}
                          </button>
                        </>
                      )}

                      <div className="mt-2">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(next) => setQuantity(item.key, next)}
                          min={0}
                          max={item.stock ?? 99}
                          size="sm"
                          label={`Cantidad de ${item.name}`}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2">
                      <button
                        type="button"
                        className="fp-iconbtn fp-iconbtn--sm text-brown-500 hover:text-red-700"
                        onClick={() => remove(item.key)}
                        aria-label={`Quitar ${item.name} del pedido`}
                      >
                        <Icon name="trash" size={18} />
                      </button>
                      <span className="tnum font-semibold whitespace-nowrap">
                        {formatPrice(itemTotal(item))}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="fp-alert fp-alert--warn my-5">
                <Icon name="calendar" size={18} className="mt-px shrink-0" />
                <p>
                  Este pedido necesita {leadTimeHours} hs de anticipación. La primera fecha posible es
                  el {formatDateShort(firstDate)}.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-line-200 py-5">
                <span className="text-[17px]">Subtotal</span>
                <span className="tnum text-[17px] font-semibold">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="sticky bottom-0 flex flex-col gap-2 border-t border-line-200 bg-cream-50 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                href="/pedido"
                onClick={close}
                className="fp-btn fp-btn--primary fp-btn--lg fp-btn--block"
              >
                Continuar con el pedido
              </Link>
              <button type="button" onClick={close} className="fp-btn fp-btn--ghost fp-btn--block">
                Seguir eligiendo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
