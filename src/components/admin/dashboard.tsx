"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProductForm } from "@/components/admin/product-form";
import { Icon } from "@/components/icon";
import { Wordmark } from "@/components/wordmark";
import { formatPrice } from "@/lib/format";
import { CATEGORIES } from "@/lib/site";
import type { Product, Settings } from "@/lib/types";

type Status = {
  driver: string;
  durable: boolean;
  derivedSecret: boolean;
  canUploadImages: boolean;
};

export function AdminDashboard({
  products,
  settings,
  status,
}: {
  products: Product[];
  settings: Settings;
  status: Status;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"productos" | "ajustes">("productos");
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function refresh(message?: string) {
    setEditing(null);
    setCreating(false);
    if (message) {
      setToast(message);
      setTimeout(() => setToast(null), 3500);
    }
    router.refresh();
  }

  async function patchProduct(product: Product, patch: Partial<Product>, message: string) {
    setBusy(product.id);
    const response = await fetch(`/api/admin/productos/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(() => null);
    setBusy(null);

    if (!response?.ok) {
      const data = ((await response?.json().catch(() => ({}))) ?? {}) as { error?: string };
      setToast(data.error ?? "No se pudo guardar.");
      setTimeout(() => setToast(null), 4000);
      return;
    }
    refresh(message);
  }

  async function removeProduct(product: Product) {
    if (!window.confirm(`¿Sacar "${product.name}" del catálogo? No se puede deshacer.`)) return;
    setBusy(product.id);
    await fetch(`/api/admin/productos/${product.id}`, { method: "DELETE" }).catch(() => null);
    setBusy(null);
    refresh(`${product.name} salió del catálogo.`);
  }

  async function logout() {
    await fetch("/api/admin/sesion", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <header className="sticky top-0 z-50 border-b border-line-200 bg-cream-100/95 backdrop-blur-sm">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Wordmark href={null} size={17} />
            <span className="hidden text-sm text-brown-500 sm:inline">Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="fp-btn fp-btn--ghost fp-btn--sm">
              Ver el sitio
            </Link>
            <button type="button" className="fp-btn fp-btn--ghost fp-btn--sm" onClick={logout}>
              <Icon name="log-out" size={16} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="wrap flex flex-col gap-6 pt-8">
        {!status.durable ? (
          <div className="fp-alert fp-alert--warn">
            <Icon name="alert" size={18} className="mt-px shrink-0" />
            <p>
              <strong className="font-semibold">Los cambios no se están guardando de forma permanente.</strong>{" "}
              Este despliegue todavía no tiene almacenamiento conectado, así que todo vuelve al
              catálogo original cuando el servidor se reinicia. Se arregla en un clic:
              en Vercel, <em>Storage → Connect Store → Blob</em>, conectarlo al proyecto y volver a
              desplegar. Ver el README, sección &ldquo;Persistencia del catálogo&rdquo;.
            </p>
          </div>
        ) : null}

        {status.derivedSecret ? (
          <div className="fp-alert fp-alert--info">
            <Icon name="lock" size={18} className="mt-px shrink-0" />
            <p>
              La firma de la sesión se está derivando de la contraseña. Funciona, pero al cambiar la
              contraseña se cierran todas las sesiones abiertas. Para desacoplarlas, definí{" "}
              <code className="rounded bg-cream-300 px-1">ADMIN_SESSION_SECRET</code> con una cadena
              larga y aleatoria.
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <h1 className="t-h1">Catálogo</h1>
          <p className="text-sm text-brown-500">
            {products.length} productos · {products.filter((p) => p.available).length} disponibles ·
            almacenamiento: {status.driver}
          </p>
        </div>

        <div role="tablist" aria-label="Secciones del panel" className="flex gap-2">
          {(
            [
              { id: "productos", label: "Productos" },
              { id: "ajustes", label: "Ajustes de entrega" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className="fp-chip"
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {toast ? (
        <div
          role="status"
          className="fixed inset-x-4 bottom-6 z-70 mx-auto w-fit max-w-[90vw] rounded-full bg-brown-900 px-5 py-3 text-sm text-cream-50 shadow-[var(--shadow-modal)]"
        >
          {toast}
        </div>
      ) : null}

      {tab === "productos" ? (
        <div className="wrap flex flex-col gap-8 pt-8">
          {creating ? (
            <ProductForm
              canUploadImages={status.canUploadImages}
              onSaved={() => refresh("Producto creado.")}
              onCancel={() => setCreating(false)}
            />
          ) : (
            <button type="button" className="fp-btn fp-btn--primary w-fit" onClick={() => setCreating(true)}>
              <Icon name="plus" size={18} />
              Agregar producto
            </button>
          )}

          {CATEGORIES.map((category) => {
            const items = products
              .filter((product) => product.category === category.id)
              .sort((a, b) => a.order - b.order);
            if (!items.length) return null;

            return (
              <section key={category.id} className="flex flex-col gap-4">
                <div className="flex items-baseline gap-4">
                  <h2 className="t-h3">{category.name}</h2>
                  <hr className="rule-gold flex-1" />
                  <span className="text-sm text-brown-500">{items.length}</span>
                </div>

                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {items.map((product) =>
                    editing === product.id ? (
                      <li key={product.id}>
                        <ProductForm
                          product={product}
                          canUploadImages={status.canUploadImages}
                          onSaved={() => refresh("Cambios guardados.")}
                          onCancel={() => setEditing(null)}
                        />
                      </li>
                    ) : (
                      <li key={product.id} className="fp-card flex flex-col gap-4 p-4 md:flex-row md:items-center">
                        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream-300">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].src}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : null}
                        </span>

                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="t-h3">{product.name}</span>
                            {product.featured ? (
                              <span className="fp-badge fp-badge--gold">Portada</span>
                            ) : null}
                            {!product.available ? (
                              <span className="fp-badge fp-badge--neutral">Pausado</span>
                            ) : null}
                            {product.available && product.stock !== null ? (
                              <span
                                className={`fp-badge ${
                                  product.stock > 0 ? "fp-badge--berry" : "fp-badge--warn"
                                }`}
                              >
                                {product.stock > 0 ? `Quedan ${product.stock}` : "Agotado"}
                              </span>
                            ) : null}
                          </div>
                          <span className="text-sm text-brown-500">
                            {product.variants
                              .map(
                                (variant) =>
                                  `${variant.label}: ${
                                    variant.price === null ? "consultar" : formatPrice(variant.price)
                                  }`,
                              )
                              .join(" · ")}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className="fp-btn fp-btn--ghost fp-btn--sm"
                            disabled={busy === product.id}
                            onClick={() =>
                              patchProduct(
                                product,
                                { available: !product.available },
                                product.available
                                  ? `${product.name} quedó pausado.`
                                  : `${product.name} vuelve al catálogo.`,
                              )
                            }
                          >
                            {product.available ? "Pausar" : "Reactivar"}
                          </button>
                          <button
                            type="button"
                            className="fp-btn fp-btn--ghost fp-btn--sm"
                            onClick={() => setEditing(product.id)}
                          >
                            <Icon name="pencil" size={16} />
                            Editar
                          </button>
                          <button
                            type="button"
                            className="fp-iconbtn fp-iconbtn--sm text-brown-500 hover:text-red-700"
                            aria-label={`Eliminar ${product.name}`}
                            disabled={busy === product.id}
                            onClick={() => removeProduct(product)}
                          >
                            <Icon name="trash" size={18} />
                          </button>
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <SettingsForm settings={settings} onSaved={() => refresh("Ajustes guardados.")} />
      )}
    </div>
  );
}

function SettingsForm({ settings, onSaved }: { settings: Settings; onSaved: () => void }) {
  const router = useRouter();
  const [draft, setDraft] = useState(settings);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  async function save() {
    setSaving(true);
    setError(null);
    const response = await fetch("/api/admin/ajustes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    }).catch(() => null);
    setSaving(false);

    if (!response?.ok) {
      const data = ((await response?.json().catch(() => ({}))) ?? {}) as { error?: string };
      setError(data.error ?? "No se pudo guardar.");
      return;
    }
    onSaved();
  }

  async function reset() {
    if (!window.confirm("¿Volver al catálogo original de Instagram? Se pierden todos los cambios.")) {
      return;
    }
    await fetch("/api/admin/ajustes", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="wrap flex max-w-[42rem] flex-col gap-6 pt-8">
      <div className="fp-card flex flex-col gap-5 p-6">
        <h2 className="t-h3">Entrega y contacto</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Costo de envío" htmlFor="st-envio">
            <input
              id="st-envio"
              type="number"
              min={0}
              step={10}
              className="fp-input tnum"
              value={draft.shippingCost}
              onChange={(event) => set("shippingCost", Number(event.target.value))}
            />
          </Field>
          <Field label="Anticipación (horas)" htmlFor="st-lead">
            <input
              id="st-lead"
              type="number"
              min={0}
              className="fp-input tnum"
              value={draft.leadTimeHours}
              onChange={(event) => set("leadTimeHours", Number(event.target.value))}
            />
          </Field>
          <Field label="Entregas desde la hora" htmlFor="st-hora">
            <input
              id="st-hora"
              type="number"
              min={0}
              max={23}
              className="fp-input tnum"
              value={draft.deliveryFromHour}
              onChange={(event) => set("deliveryFromHour", Number(event.target.value))}
            />
          </Field>
          <Field label="WhatsApp visible" htmlFor="st-wa-vis" help="Como se muestra: 096 247 822">
            <input
              id="st-wa-vis"
              className="fp-input"
              value={draft.whatsappDisplay}
              onChange={(event) => set("whatsappDisplay", event.target.value)}
            />
          </Field>
        </div>

        <Field
          label="WhatsApp internacional"
          htmlFor="st-wa"
          help="Sin signos ni espacios, con código de país: 59896247822"
        >
          <input
            id="st-wa"
            className="fp-input tnum"
            value={draft.whatsappE164}
            onChange={(event) => set("whatsappE164", event.target.value)}
          />
        </Field>

        <Field
          label="Aviso en el sitio"
          htmlFor="st-aviso"
          help="Sale como una franja arriba de todo. Dejalo vacío para ocultarlo."
        >
          <input
            id="st-aviso"
            className="fp-input"
            maxLength={200}
            placeholder="Esta semana no tomo pedidos nuevos"
            value={draft.announcement}
            onChange={(event) => set("announcement", event.target.value)}
          />
        </Field>

        {error ? (
          <p className="fp-alert fp-alert--error" role="alert">
            <Icon name="alert" size={18} className="mt-px shrink-0" />
            {error}
          </p>
        ) : null}

        <button type="button" className="fp-btn fp-btn--primary fp-btn--lg w-fit" onClick={save} disabled={saving}>
          {saving ? "Guardando…" : "Guardar ajustes"}
        </button>
      </div>

      <div className="fp-card flex flex-col gap-3 p-6">
        <h2 className="t-h3">Restablecer</h2>
        <p className="text-sm leading-relaxed text-brown-500">
          Vuelve el catálogo y los ajustes al estado publicado en Instagram al 12 de agosto de 2026.
          Se pierden todos los cambios hechos desde el panel.
        </p>
        <button type="button" className="fp-btn fp-btn--ghost w-fit" onClick={reset}>
          <Icon name="rotate-ccw" size={18} />
          Volver al catálogo original
        </button>
      </div>
    </div>
  );
}

function Field({
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
