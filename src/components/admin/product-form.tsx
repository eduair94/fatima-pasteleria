"use client";

import Image from "next/image";
import { useState } from "react";

import { Icon } from "@/components/icon";
import { slugify } from "@/lib/format";
import { CATEGORIES } from "@/lib/site";
import type { Product, Variant } from "@/lib/types";

type Draft = Omit<Product, "updatedAt"> & { updatedAt?: string };

const EMPTY: Draft = {
  id: "",
  slug: "",
  name: "",
  category: "tortas",
  summary: "",
  description: "",
  images: [],
  variants: [{ id: "unico", label: "Entero", price: null }],
  leadTimeHours: 48,
  available: true,
  stock: null,
  badge: "",
  featured: false,
  order: 99,
  instagramUrl: "",
};

export function ProductForm({
  product,
  onSaved,
  onCancel,
}: {
  product?: Product;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(product ? { ...product } : { ...EMPTY });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isNew = !product;

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  function setVariant(index: number, patch: Partial<Variant>) {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((variant, position) =>
        position === index ? { ...variant, ...patch } : variant,
      ),
    }));
  }

  async function save() {
    setSaving(true);
    setError(null);

    const payload = {
      ...draft,
      slug: draft.slug || slugify(draft.name),
      badge: draft.badge || undefined,
      instagramUrl: draft.instagramUrl || undefined,
    };

    const response = await fetch(
      isNew ? "/api/admin/productos" : `/api/admin/productos/${product!.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    ).catch(() => null);

    if (!response || !response.ok) {
      const data = ((await response?.json().catch(() => ({}))) ?? {}) as { error?: string };
      setError(data.error ?? "No se pudo guardar.");
      setSaving(false);
      return;
    }

    setSaving(false);
    onSaved();
  }

  return (
    <div className="fp-card flex flex-col gap-6 p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="t-h3">{isNew ? "Producto nuevo" : `Editar ${product!.name}`}</h3>
        <button type="button" className="fp-iconbtn" onClick={onCancel} aria-label="Cerrar el editor">
          <Icon name="x" size={20} />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Labelled label="Nombre" htmlFor="pf-nombre">
          <input
            id="pf-nombre"
            className="fp-input"
            value={draft.name}
            onChange={(event) => {
              const name = event.target.value;
              setDraft((current) => ({
                ...current,
                name,
                slug: isNew || !current.slug ? slugify(name) : current.slug,
              }));
            }}
          />
        </Labelled>

        <Labelled label="Categoría" htmlFor="pf-categoria">
          <select
            id="pf-categoria"
            className="fp-input"
            value={draft.category}
            onChange={(event) => set("category", event.target.value)}
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Labelled>

        <Labelled label="Dirección web" htmlFor="pf-slug" help={`/producto/${draft.slug || "…"}`}>
          <input
            id="pf-slug"
            className="fp-input"
            value={draft.slug}
            onChange={(event) => set("slug", slugify(event.target.value))}
          />
        </Labelled>

        <Labelled label="Etiqueta sobre la foto" htmlFor="pf-badge" help="Por ejemplo: Cantidad limitada">
          <input
            id="pf-badge"
            className="fp-input"
            value={draft.badge ?? ""}
            onChange={(event) => set("badge", event.target.value)}
          />
        </Labelled>
      </div>

      <Labelled label="Resumen" htmlFor="pf-summary" help="Una línea. Se usa en la tarjeta y en Google.">
        <input
          id="pf-summary"
          className="fp-input"
          maxLength={200}
          value={draft.summary}
          onChange={(event) => set("summary", event.target.value)}
        />
      </Labelled>

      <Labelled label="Descripción" htmlFor="pf-desc" help="Dos o tres frases para la ficha del producto.">
        <textarea
          id="pf-desc"
          className="fp-input"
          rows={3}
          maxLength={1200}
          value={draft.description}
          onChange={(event) => set("description", event.target.value)}
        />
      </Labelled>

      {/* ------------------------------------------------------ opciones */}
      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="fp-label p-0">Opciones y precios</legend>
        <p className="fp-help -mt-1">
          Dejá el precio vacío para que se muestre como &ldquo;Consultar&rdquo; con un botón de WhatsApp.
        </p>

        {draft.variants.map((variant, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-[1fr_130px_1fr_44px]">
            <input
              className="fp-input"
              placeholder="Entero, Porción, 6 unidades…"
              value={variant.label}
              aria-label={`Etiqueta de la opción ${index + 1}`}
              onChange={(event) => setVariant(index, { label: event.target.value })}
            />
            <input
              className="fp-input tnum"
              type="number"
              min={0}
              step={10}
              placeholder="Precio"
              value={variant.price ?? ""}
              aria-label={`Precio de la opción ${index + 1}`}
              onChange={(event) =>
                setVariant(index, {
                  price: event.target.value === "" ? null : Number(event.target.value),
                })
              }
            />
            <input
              className="fp-input"
              placeholder="Detalle (10 porciones, c/u)"
              value={variant.detail ?? ""}
              aria-label={`Detalle de la opción ${index + 1}`}
              onChange={(event) => setVariant(index, { detail: event.target.value })}
            />
            <button
              type="button"
              className="fp-iconbtn fp-iconbtn--outline justify-self-start text-brown-500 hover:text-red-700"
              disabled={draft.variants.length === 1}
              aria-label={`Quitar la opción ${index + 1}`}
              onClick={() =>
                set(
                  "variants",
                  draft.variants.filter((_, position) => position !== index),
                )
              }
            >
              <Icon name="trash" size={18} />
            </button>
          </div>
        ))}

        <button
          type="button"
          className="fp-btn fp-btn--ghost fp-btn--sm w-fit"
          onClick={() =>
            set("variants", [
              ...draft.variants,
              { id: `opcion-${draft.variants.length + 1}`, label: "", price: null },
            ])
          }
        >
          <Icon name="plus" size={16} />
          Agregar opción
        </button>
      </fieldset>

      {/* --------------------------------------------------------- fotos */}
      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="fp-label p-0">Fotos</legend>
        <p className="fp-help -mt-1">
          Ruta dentro del sitio (/fotos/nombre.webp) o una URL https. El texto alternativo describe lo
          que se ve: sirve para Google y para quien no ve la imagen.
        </p>

        {draft.images.map((image, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-[64px_1fr_1fr_44px] sm:items-center">
            <span className="relative h-16 w-16 overflow-hidden rounded-lg bg-cream-300">
              {image.src ? (
                <Image src={image.src} alt="" fill sizes="64px" className="object-cover" />
              ) : null}
            </span>
            <input
              className="fp-input"
              placeholder="/fotos/mi-foto.webp"
              value={image.src}
              aria-label={`Ruta de la foto ${index + 1}`}
              onChange={(event) =>
                set(
                  "images",
                  draft.images.map((item, position) =>
                    position === index ? { ...item, src: event.target.value } : item,
                  ),
                )
              }
            />
            <input
              className="fp-input"
              placeholder="Qué se ve en la foto"
              value={image.alt}
              aria-label={`Texto alternativo de la foto ${index + 1}`}
              onChange={(event) =>
                set(
                  "images",
                  draft.images.map((item, position) =>
                    position === index ? { ...item, alt: event.target.value } : item,
                  ),
                )
              }
            />
            <button
              type="button"
              className="fp-iconbtn fp-iconbtn--outline justify-self-start text-brown-500 hover:text-red-700"
              aria-label={`Quitar la foto ${index + 1}`}
              onClick={() =>
                set(
                  "images",
                  draft.images.filter((_, position) => position !== index),
                )
              }
            >
              <Icon name="trash" size={18} />
            </button>
          </div>
        ))}

        <button
          type="button"
          className="fp-btn fp-btn--ghost fp-btn--sm w-fit"
          disabled={draft.images.length >= 6}
          onClick={() => set("images", [...draft.images, { src: "", alt: "" }])}
        >
          <Icon name="image" size={16} />
          Agregar foto
        </button>
      </fieldset>

      {/* --------------------------------------------------------- extras */}
      <div className="grid gap-5 md:grid-cols-4">
        <Labelled
          label="Unidades disponibles"
          htmlFor="pf-stock"
          help="Vacío = sin límite. En 0 se muestra como agotado."
        >
          <input
            id="pf-stock"
            type="number"
            min={0}
            className="fp-input tnum"
            placeholder="Sin límite"
            value={draft.stock ?? ""}
            onChange={(event) =>
              set("stock", event.target.value === "" ? null : Number(event.target.value))
            }
          />
        </Labelled>
        <Labelled label="Anticipación (horas)" htmlFor="pf-lead">
          <input
            id="pf-lead"
            type="number"
            min={0}
            className="fp-input tnum"
            value={draft.leadTimeHours}
            onChange={(event) => set("leadTimeHours", Number(event.target.value))}
          />
        </Labelled>
        <Labelled label="Orden dentro del grupo" htmlFor="pf-order">
          <input
            id="pf-order"
            type="number"
            min={0}
            className="fp-input tnum"
            value={draft.order}
            onChange={(event) => set("order", Number(event.target.value))}
          />
        </Labelled>
        <Labelled label="Publicación de Instagram" htmlFor="pf-ig">
          <input
            id="pf-ig"
            className="fp-input"
            placeholder="https://instagram.com/p/…"
            value={draft.instagramUrl ?? ""}
            onChange={(event) => set("instagramUrl", event.target.value)}
          />
        </Labelled>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="fp-optioncard relative w-fit">
          <input
            type="checkbox"
            checked={draft.available}
            onChange={(event) => set("available", event.target.checked)}
          />
          <span className="fp-radiodot rounded-xs!" aria-hidden="true" />
          <span>Disponible para pedir</span>
        </label>
        <label className="fp-optioncard relative w-fit">
          <input
            type="checkbox"
            checked={Boolean(draft.featured)}
            onChange={(event) => set("featured", event.target.checked)}
          />
          <span className="fp-radiodot rounded-xs!" aria-hidden="true" />
          <span>Destacar en la portada</span>
        </label>
      </div>

      {error ? (
        <p className="fp-alert fp-alert--error" role="alert">
          <Icon name="alert" size={18} className="mt-px shrink-0" />
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-line-200 pt-5 sm:flex-row">
        <button
          type="button"
          className="fp-btn fp-btn--primary fp-btn--lg"
          onClick={save}
          disabled={saving || !draft.name.trim()}
        >
          {saving ? "Guardando…" : isNew ? "Crear producto" : "Guardar cambios"}
        </button>
        <button type="button" className="fp-btn fp-btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function Labelled({
  label,
  htmlFor,
  help,
  children,
}: {
  label: string;
  htmlFor: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="fp-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {help ? <p className="fp-help">{help}</p> : null}
    </div>
  );
}
