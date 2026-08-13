"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cloneElement, useMemo, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { Icon } from "@/components/icon";
import {
  firstAvailableDate,
  formatDateLong,
  formatDateShort,
  formatPrice,
  orderReference,
} from "@/lib/format";
import { saveOrderSummary } from "@/lib/order-summary";
import { SITE, ZONES } from "@/lib/site";
import type { DeliveryMode, OrderDetails } from "@/lib/types";
import { buildOrderMessage, itemTotal, orderTotals, waLink, zoneById } from "@/lib/whatsapp";

type Touched = Partial<Record<keyof OrderDetails, boolean>>;

/** Para poder llevar el foco al primer campo que falta. */
const FIELD_IDS: Partial<Record<keyof OrderDetails, string>> = {
  name: "nombre",
  phone: "telefono",
  date: "fecha",
  zoneId: "zona",
  address: "direccion",
};

export function CheckoutForm() {
  const { items, settings, leadTimeHours, clear, ready } = useCart();
  const router = useRouter();

  const minDate = firstAvailableDate(leadTimeHours);

  const [details, setDetails] = useState<OrderDetails>({
    name: "",
    phone: "",
    date: minDate,
    // Retiro por defecto: es sin costo. Preseleccionar envío le sumaba $ 100 al
    // total antes de que la clienta eligiera nada.
    mode: "retiro",
    zoneId: ZONES[0]?.id,
    address: "",
    apartment: "",
    reference: "",
    comments: "",
  });
  const [touched, setTouched] = useState<Touched>({});

  const set = <K extends keyof OrderDetails>(key: K, value: OrderDetails[K]) =>
    setDetails((current) => ({ ...current, [key]: value }));

  const totals = orderTotals(items, details, settings);
  const zone = zoneById(details.zoneId);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof OrderDetails, string>> = {};
    if (!details.name.trim()) next.name = "Necesito tu nombre para el pedido.";

    // El teléfono es opcional: el pedido llega por WhatsApp, así que el número
    // ya viene con el mensaje. Sólo se avisa si lo que escribieron no parece
    // un teléfono, para que no viaje un dato mal copiado.
    const digits = details.phone.replace(/\D/g, "");
    if (digits.length > 0 && digits.length < 8) {
      next.phone = "Ese teléfono parece incompleto. Podés dejarlo vacío.";
    }

    if (!details.date) next.date = "Elegí una fecha de entrega.";
    else if (details.date < minDate) {
      next.date = `Necesito ${leadTimeHours} hs. La primera fecha posible es el ${formatDateShort(minDate)}.`;
    }
    if (details.mode === "envio") {
      if (!details.zoneId) next.zoneId = "Elegí la zona de entrega.";
      if (!details.address?.trim()) next.address = "Necesito la dirección para el envío.";
    }
    return next;
  }, [details, minDate, leadTimeHours]);

  const valid = Object.keys(errors).length === 0 && items.length > 0;
  const reference = useMemo(() => orderReference(), []);
  const message = valid ? buildOrderMessage(items, details, settings, reference) : "";
  const link = valid ? waLink(settings.whatsappE164, message) : "";

  const showError = (field: keyof OrderDetails) => (touched[field] ? errors[field] : undefined);
  const markTouched = (field: keyof OrderDetails) =>
    setTouched((current) => ({ ...current, [field]: true }));

  function handleSend() {
    saveOrderSummary({ items, details, totals, reference, settings });
    clear();
    router.push("/pedido/enviado");
  }

  if (ready && items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[18px] border border-dashed border-line-300 bg-cream-50 px-6 py-16 text-center">
        <Icon name="bag" size={26} className="text-brown-300" />
        <p className="t-h3">Tu pedido está vacío</p>
        <p className="max-w-[24rem] text-sm leading-relaxed text-brown-500">
          Elegí del catálogo y volvé acá para dejar tus datos.
        </p>
        <Link href="/catalogo" className="fp-btn fp-btn--primary fp-btn--lg mt-2">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-10 md:grid-cols-[1fr_400px] md:gap-14">
      <form className="flex flex-col gap-6" onSubmit={(event) => event.preventDefault()} noValidate>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Nombre y apellido" htmlFor="nombre" error={showError("name")}>
            <input
              id="nombre"
              className="fp-input"
              value={details.name}
              autoComplete="name"
              placeholder="Carolina Píriz"
              aria-invalid={Boolean(showError("name"))}
              onChange={(event) => set("name", event.target.value)}
              onBlur={() => markTouched("name")}
            />
          </Field>

          <Field
            label="Teléfono"
            htmlFor="telefono"
            optional
            help="Si preferís que te escriba a otro número."
            error={showError("phone")}
          >
            <input
              id="telefono"
              type="tel"
              inputMode="tel"
              className="fp-input"
              value={details.phone}
              autoComplete="tel"
              placeholder="099 123 456"
              aria-invalid={Boolean(showError("phone"))}
              onChange={(event) => set("phone", event.target.value)}
              onBlur={() => markTouched("phone")}
            />
          </Field>
        </div>

        <Field
          label="Fecha de entrega"
          htmlFor="fecha"
          help={`Primera fecha posible: ${formatDateShort(minDate)}. Entregas a partir de las ${settings.deliveryFromHour} h.`}
          error={showError("date")}
        >
          <input
            id="fecha"
            type="date"
            className="fp-input"
            value={details.date}
            min={minDate}
            aria-invalid={Boolean(showError("date"))}
            onChange={(event) => set("date", event.target.value)}
            onBlur={() => markTouched("date")}
          />
        </Field>

        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="fp-label mb-2 p-0">Retiro o envío</legend>
          <div className="flex flex-col gap-3 sm:flex-row">
            {(
              [
                { id: "retiro", label: "Retiro", detail: `Sin costo · ${SITE.neighborhoods}` },
                {
                  id: "envio",
                  label: "Envío",
                  detail: `${formatPrice(settings.shippingCost)} en zona`,
                },
              ] as { id: DeliveryMode; label: string; detail: string }[]
            ).map((option) => (
              <label key={option.id} className="fp-optioncard relative flex-1">
                <input
                  type="radio"
                  name="modalidad"
                  value={option.id}
                  checked={details.mode === option.id}
                  onChange={() => set("mode", option.id)}
                />
                <span className="fp-radiodot" aria-hidden="true" />
                <span className="flex flex-col">
                  <span>{option.label}</span>
                  <span className="text-sm text-brown-500">{option.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {details.mode === "envio" ? (
          <div className="anim-fade flex flex-col gap-5 rounded-[18px] border border-dashed border-line-300 bg-cream-50 p-5">
            <p className="eyebrow">Datos del envío</p>

            <Field
              label="Zona"
              htmlFor="zona"
              help="La tarifa aparece al elegir la zona."
              error={showError("zoneId")}
            >
              <select
                id="zona"
                className="fp-input"
                value={details.zoneId}
                onChange={(event) => set("zoneId", event.target.value)}
                onBlur={() => markTouched("zoneId")}
              >
                {ZONES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                    {item.cost === null ? " — a coordinar" : ` — ${formatPrice(settings.shippingCost)}`}
                  </option>
                ))}
              </select>
            </Field>

            {zone?.cost === null ? (
              <div className="fp-alert fp-alert--info">
                <Icon name="info" size={18} className="mt-px shrink-0" />
                <p>
                  <strong className="font-semibold">El envío queda a coordinar.</strong> Fuera de las
                  seis zonas fijas te confirmo el costo por WhatsApp antes de cerrar el pedido. El
                  total todavía no lo incluye.
                </p>
              </div>
            ) : null}

            <Field label="Dirección" htmlFor="direccion" error={showError("address")}>
              <input
                id="direccion"
                className="fp-input"
                value={details.address}
                autoComplete="street-address"
                placeholder="Calle y número"
                aria-invalid={Boolean(showError("address"))}
                onChange={(event) => set("address", event.target.value)}
                onBlur={() => markTouched("address")}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Apartamento" htmlFor="apto" optional>
                <input
                  id="apto"
                  className="fp-input"
                  value={details.apartment}
                  placeholder="302"
                  onChange={(event) => set("apartment", event.target.value)}
                />
              </Field>
              <Field label="Referencia" htmlFor="referencia" optional>
                <input
                  id="referencia"
                  className="fp-input"
                  value={details.reference}
                  placeholder="Timbre, esquina"
                  onChange={(event) => set("reference", event.target.value)}
                />
              </Field>
            </div>
          </div>
        ) : (
          <div className="fp-alert fp-alert--info">
            <Icon name="map-pin" size={18} className="mt-px shrink-0" />
            <p>
              El retiro es en {SITE.neighborhoods}. La dirección exacta y la hora las coordinamos por
              WhatsApp.
            </p>
          </div>
        )}

        <Field label="Comentarios" htmlFor="comentarios" optional>
          <textarea
            id="comentarios"
            className="fp-input"
            rows={3}
            maxLength={400}
            placeholder="Algo más que tenga que saber"
            value={details.comments}
            onChange={(event) => set("comments", event.target.value)}
          />
        </Field>
      </form>

      {/* ------------------------------------------------------- resumen */}
      <aside className="fp-card flex flex-col gap-4 p-6 md:sticky md:top-24">
        <h2 className="t-h2">Resumen del pedido</h2>

        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {items.map((item) => (
            <li key={item.key} className="flex items-center gap-3">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-300">
                {item.image ? (
                  <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                ) : null}
              </span>
              <span className="flex-1 text-sm leading-snug">
                {item.quantity} × {item.name}
                {item.variantLabel ? (
                  <span className="block text-brown-500">{item.variantLabel}</span>
                ) : null}
                {item.note ? <span className="block text-brown-500">{item.note}</span> : null}
              </span>
              <span className="tnum text-sm font-semibold">{formatPrice(itemTotal(item))}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 border-t border-line-200 pt-4">
          <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
          {details.mode === "envio" ? (
            <Row
              label={`Envío · ${zone?.name ?? ""}`}
              value={totals.shipping === null ? "A coordinar" : formatPrice(totals.shipping)}
            />
          ) : (
            <Row label="Retiro" value="Sin costo" />
          )}
          <div className="flex items-center justify-between border-t border-line-200 pt-3 text-[19px] font-semibold">
            <span>Total</span>
            <span className="tnum">
              {formatPrice(totals.subtotal + (totals.shipping ?? 0))}
              {totals.totalPending ? " + envío" : ""}
            </span>
          </div>
        </div>

        <div className="fp-alert fp-alert--warn">
          <Icon name="calendar" size={18} className="mt-px shrink-0" />
          <p>Entrega el {formatDateLong(details.date)}, a partir de las {settings.deliveryFromHour} h.</p>
        </div>

        {valid ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSend}
            className="fp-btn fp-btn--whatsapp fp-btn--lg fp-btn--block"
          >
            <Icon name="whatsapp" size={18} />
            Enviar pedido por WhatsApp
          </a>
        ) : (
          // No lleva `disabled` nativo: así el botón sigue en el orden de
          // tabulación y al tocarlo marca los campos que faltan y lleva el foco
          // al primero, en lugar de no hacer nada.
          <button
            type="button"
            aria-disabled="true"
            className="fp-btn fp-btn--whatsapp fp-btn--lg fp-btn--block"
            onClick={() => {
              setTouched({ name: true, date: true, address: true, zoneId: true });
              const firstInvalid = (
                ["name", "phone", "date", "zoneId", "address"] as (keyof OrderDetails)[]
              ).find((field) => errors[field]);
              const id = firstInvalid ? FIELD_IDS[firstInvalid] : undefined;
              if (id) document.getElementById(id)?.focus();
            }}
          >
            <Icon name="whatsapp" size={18} />
            Enviar pedido por WhatsApp
          </button>
        )}

        <p className="text-sm leading-relaxed text-brown-500">
          {valid
            ? "Se abre WhatsApp con el pedido ya redactado. Fátima confirma disponibilidad y entrega por ese mismo chat. No se paga en el sitio."
            : `El botón se habilita cuando estén nombre y fecha${
                details.mode === "envio" ? ", más zona y dirección" : ""
              }.`}
        </p>
      </aside>

      {/* En mobile el resumen queda debajo de todo el formulario, así que el
          botón de enviar quedaba a un scroll largo del campo que lo habilita.
          Esta barra lo deja siempre a mano, con el total a la vista. */}
      <div className="fixed inset-x-0 bottom-0 z-60 flex items-center gap-4 border-t border-line-200 bg-cream-50 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-bar)] md:hidden">
        <span className="flex flex-col leading-tight">
          <span className="text-xs text-brown-500">Total</span>
          <span className="tnum text-[17px] font-semibold whitespace-nowrap">
            {formatPrice(totals.subtotal + (totals.shipping ?? 0))}
            {totals.totalPending ? " + envío" : ""}
          </span>
        </span>
        {valid ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSend}
            className="fp-btn fp-btn--whatsapp ml-auto"
          >
            <Icon name="whatsapp" size={18} />
            Enviar pedido
          </a>
        ) : (
          <button
            type="button"
            aria-disabled="true"
            className="fp-btn fp-btn--whatsapp ml-auto"
            onClick={() => {
              setTouched({ name: true, date: true, address: true, zoneId: true });
              const firstInvalid = (
                ["name", "date", "zoneId", "address"] as (keyof OrderDetails)[]
              ).find((field) => errors[field]);
              const id = firstInvalid ? FIELD_IDS[firstInvalid] : undefined;
              if (id) {
                const el = document.getElementById(id);
                el?.scrollIntoView({ block: "center", behavior: "smooth" });
                el?.focus({ preventScroll: true });
              }
            }}
          >
            <Icon name="whatsapp" size={18} />
            Enviar pedido
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm text-brown-700">
      <span>{label}</span>
      <span className="tnum">{value}</span>
    </div>
  );
}

/**
 * Envoltorio de campo. La ayuda y el error se atan al input con
 * `aria-describedby`, así un lector de pantalla los lee junto con la etiqueta
 * en lugar de dejarlos sueltos en la página.
 */
function Field({
  label,
  htmlFor,
  help,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  help?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactElement<{ "aria-describedby"?: string }>;
}) {
  const describedBy = error ? `${htmlFor}-error` : help ? `${htmlFor}-help` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label className="fp-label" htmlFor={htmlFor}>
        {label} {optional ? <span className="font-normal text-brown-500">(opcional)</span> : null}
      </label>
      {describedBy ? cloneElement(children, { "aria-describedby": describedBy }) : children}
      {error ? (
        <p className="fp-error" id={`${htmlFor}-error`} role="alert">
          <Icon name="alert" size={16} className="shrink-0" />
          {error}
        </p>
      ) : help ? (
        <p className="fp-help" id={`${htmlFor}-help`}>
          {help}
        </p>
      ) : null}
    </div>
  );
}
