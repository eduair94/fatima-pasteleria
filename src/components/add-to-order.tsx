"use client";

import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import { Icon } from "@/components/icon";
import { QuantityStepper } from "@/components/quantity-stepper";
import { firstAvailableDate, formatDateShort, formatPrice, formatVariantPrice } from "@/lib/format";
import { hasPrice, isSoldOut, stockNote } from "@/lib/product";
import type { Product } from "@/lib/types";
import { buildProductInquiry, waLink } from "@/lib/whatsapp";

export function AddToOrder({ product }: { product: Product }) {
  const { add, settings } = useCart();
  const priced = product.variants.filter((variant) => variant.price !== null);
  const [variantId, setVariantId] = useState(priced[0]?.id ?? product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const firstDate = firstAvailableDate(product.leadTimeHours);

  if (!hasPrice(product)) {
    return (
      <div className="flex flex-col gap-3">
        <div className="fp-alert fp-alert--info">
          <Icon name="info" size={18} className="mt-px shrink-0" />
          <p>
            Este producto no tiene precio publicado: depende del tamaño y de la cantidad. Escribime y
            te paso el precio y la disponibilidad.
          </p>
        </div>
        <a
          href={waLink(settings.whatsappE164, buildProductInquiry(product.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="fp-btn fp-btn--whatsapp fp-btn--lg fp-btn--block"
        >
          <Icon name="whatsapp" size={18} />
          Consultar por WhatsApp
        </a>
      </div>
    );
  }

  if (!product.available || isSoldOut(product)) {
    return (
      <div className="flex flex-col gap-3">
        <div className="fp-alert fp-alert--warn">
          <Icon name="cookie" size={18} className="mt-px shrink-0" />
          <p>
            {isSoldOut(product)
              ? `Se agotó la tanda de ${product.name.toLowerCase()}.`
              : `Esta semana no hay ${product.name.toLowerCase()}.`}{" "}
            Escribime y te aviso cuando vuelve.
          </p>
        </div>
        <a
          href={waLink(settings.whatsappE164, buildProductInquiry(product.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="fp-btn fp-btn--whatsapp fp-btn--lg fp-btn--block"
        >
          <Icon name="whatsapp" size={18} />
          Avisame cuando vuelva
        </a>
      </div>
    );
  }

  const total = (variant?.price ?? 0) * quantity;
  const escasez = stockNote(product);

  return (
    <div className="flex flex-col gap-6">
      {priced.length > 1 ? (
        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="fp-label mb-2 p-0">Tamaño</legend>
          <div className="flex flex-col gap-3 sm:flex-row">
            {priced.map((option) => (
              <label key={option.id} className="fp-optioncard relative flex-1">
                <input
                  type="radio"
                  name={`variante-${product.id}`}
                  value={option.id}
                  checked={variantId === option.id}
                  onChange={() => setVariantId(option.id)}
                />
                <span className="fp-radiodot" aria-hidden="true" />
                <span className="flex flex-col">
                  <span>{option.label}</span>
                  <span className="text-sm text-brown-500">
                    {formatVariantPrice(option.price)}
                    {option.detail ? ` · ${option.detail}` : ""}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="flex items-baseline gap-2">
          <span className="tnum text-2xl font-semibold">{formatVariantPrice(variant?.price ?? null)}</span>
          <span className="text-sm text-brown-500">{variant?.label}</span>
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="fp-label" htmlFor={`nota-${product.id}`}>
          Nota para este ítem <span className="font-normal text-brown-500">(opcional)</span>
        </label>
        <textarea
          id={`nota-${product.id}`}
          className="fp-input min-h-[80px]!"
          rows={2}
          maxLength={200}
          placeholder="Dedicatoria, sin azúcar, alergias"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>

      <div className="fp-alert fp-alert--warn">
        <Icon name="calendar" size={18} className="mt-px shrink-0" />
        <p>
          {product.leadTimeHours} hs de anticipación. La primera fecha posible es el{" "}
          {formatDateShort(firstDate)}, con entrega a partir de las {settings.deliveryFromHour} h.
        </p>
      </div>

      {escasez ? (
        <p className="flex items-center gap-2 text-sm text-berry-700">
          <Icon name="cookie" size={16} className="shrink-0" />
          {escasez} de esta tanda.
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={product.stock ?? 99}
          label={`Cantidad de ${product.name}`}
        />
        <button
          type="button"
          className="fp-btn fp-btn--primary fp-btn--lg flex-1"
          onClick={() => {
            if (variant) add(product, variant, quantity, note.trim() || undefined);
            setQuantity(1);
            setNote("");
          }}
        >
          Agregar · {formatPrice(total)}
        </button>
      </div>
    </div>
  );
}
