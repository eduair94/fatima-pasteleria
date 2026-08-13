"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/icon";
import { formatDateShort, formatPrice, slugify } from "@/lib/format";
import { CATEGORIES } from "@/lib/site";
import type { Proposal, SyncReport } from "@/lib/types";

type SyncStatus = {
  active: string | null;
  configured: boolean;
  missing: string[];
  gemini: boolean;
  username: string;
  ready: boolean;
};

/**
 * Revisión de lo que llegó de Instagram. La propuesta se muestra al lado del
 * caption original: no hay forma de aprobar un precio sin ver de dónde salió.
 */
export function Proposals({
  proposals,
  status,
  lastSync,
}: {
  proposals: Proposal[];
  status: SyncStatus;
  lastSync?: SyncReport;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  /**
   * El scraper tarda entre 20 y 40 segundos y arranca en otra máquina, así que
   * la primera llamada sólo lo dispara. Se vuelve a preguntar cada cuatro
   * segundos hasta que hay resultado, con tres minutos de tope.
   */
  async function buscar() {
    setBusy(true);
    setMensaje("Buscando en Instagram…");

    const limite = Date.now() + 3 * 60 * 1000;

    while (Date.now() < limite) {
      const response = await fetch("/api/admin/instagram", { method: "POST" }).catch(() => null);
      const data = ((await response?.json().catch(() => ({}))) ?? {}) as {
        state?: string;
        report?: SyncReport;
      };

      if (data.state === "pendiente") {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        continue;
      }

      setBusy(false);

      if (!data.report) {
        setMensaje("No se pudo buscar. Probá de nuevo.");
        return;
      }
      if (data.report.error) {
        setMensaje(data.report.error);
        return;
      }

      setMensaje(
        `${data.report.postsFound} publicaciones leídas · ${data.report.newProposals} nuevas · ${data.report.skipped} ya estaban`,
      );
      router.refresh();
      return;
    }

    setBusy(false);
    setMensaje("La búsqueda está tardando más de lo normal. Volvé a intentar en un rato.");
  }

  async function probar() {
    setBusy(true);
    setMensaje(null);
    const response = await fetch("/api/admin/instagram", { method: "PUT" }).catch(() => null);
    const data = ((await response?.json().catch(() => ({}))) ?? {}) as {
      error?: string;
      count?: number;
      provider?: string;
      posts?: { shortcode: string; caption: string }[];
    };
    setBusy(false);
    setMensaje(
      data.error ??
        `${data.provider}: ${data.count} publicaciones. La última empieza con “${data.posts?.[0]?.caption.slice(0, 60) ?? "—"}…”`,
    );
  }

  return (
    <div className="wrap flex flex-col gap-6 pt-8">
      <div className="fp-card flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="t-h3">Novedades de Instagram</h2>
            <p className="text-sm text-brown-500">
              Se leen las publicaciones de @{status.username} y se propone una ficha. Nada se
              publica sin tu aprobación.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="fp-btn fp-btn--ghost fp-btn--sm"
              onClick={probar}
              disabled={busy || !status.configured}
            >
              Probar conexión
            </button>
            <button
              type="button"
              className="fp-btn fp-btn--primary fp-btn--sm"
              onClick={buscar}
              disabled={busy || !status.ready}
            >
              <Icon name={busy ? "loader" : "rotate-ccw"} size={16} className={busy ? "animate-spin" : ""} />
              {busy ? "Buscando…" : "Buscar novedades"}
            </button>
          </div>
        </div>

        {!status.ready ? (
          <div className="fp-alert fp-alert--warn">
            <Icon name="alert" size={18} className="mt-px shrink-0" />
            <p>
              {!status.configured
                ? `Falta configurar el proveedor de Instagram: ${status.missing.join(", ") || "ninguno elegido"}.`
                : "Falta GEMINI_API_KEY."}{" "}
              Está explicado en el README, sección “Sincronizar con Instagram”.
            </p>
          </div>
        ) : null}

        {mensaje ? (
          <p className="fp-alert fp-alert--info" role="status">
            <Icon name="info" size={18} className="mt-px shrink-0" />
            {mensaje}
          </p>
        ) : null}

        {lastSync ? (
          <p className="fp-help">
            Última búsqueda: {formatDateShort(lastSync.ranAt.slice(0, 10))} · proveedor{" "}
            {lastSync.provider}
            {lastSync.error ? ` · terminó con error: ${lastSync.error}` : ""}
          </p>
        ) : null}
      </div>

      {proposals.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[18px] border border-dashed border-line-300 bg-cream-50 px-6 py-14 text-center">
          <Icon name="check-circle" size={26} className="text-brown-300" />
          <p className="t-h3">No hay nada para revisar</p>
          <p className="max-w-[26rem] text-sm leading-relaxed text-brown-500">
            Cuando aparezca una publicación nueva en Instagram, va a esperar acá con la ficha ya
            redactada.
          </p>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-5 p-0">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onDone={(texto) => {
                setMensaje(texto);
                router.refresh();
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ProposalCard({
  proposal,
  onDone,
}: {
  proposal: Proposal;
  onDone: (mensaje: string) => void;
}) {
  const [draft, setDraft] = useState(() => ({
    name: proposal.draft.name ?? "",
    slug: proposal.draft.slug ?? slugify(proposal.draft.name ?? ""),
    category: proposal.draft.category ?? "tortas",
    summary: proposal.draft.summary ?? "",
    description: proposal.draft.description ?? "",
    badge: proposal.draft.badge ?? "",
    variants: proposal.draft.variants ?? [{ id: "consultar", label: "A coordinar", price: null }],
    images: proposal.draft.images ?? proposal.imageUrls.map((src) => ({ src, alt: "" })),
  }));
  const [busy, setBusy] = useState<"aprobar" | "descartar" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function aprobar() {
    setBusy("aprobar");
    setError(null);
    const response = await fetch(`/api/admin/propuestas/${proposal.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        badge: draft.badge || undefined,
        leadTimeHours: 48,
        available: true,
        stock: null,
        order: 99,
        instagramUrl: proposal.postUrl,
      }),
    }).catch(() => null);

    if (!response?.ok) {
      const data = ((await response?.json().catch(() => ({}))) ?? {}) as { error?: string };
      setError(data.error ?? "No se pudo publicar.");
      setBusy(null);
      return;
    }

    setBusy(null);
    onDone(`${draft.name} se publicó en el catálogo.`);
  }

  async function descartar() {
    setBusy("descartar");
    await fetch(`/api/admin/propuestas/${proposal.id}`, { method: "DELETE" }).catch(() => null);
    setBusy(null);
    onDone("Propuesta descartada.");
  }

  return (
    <li className="fp-card flex flex-col gap-5 p-5 md:p-6">
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        {/* --------------------------------------------- la publicación */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-cream-300">
            {proposal.imageUrls[0] ? (
              <Image
                src={proposal.imageUrls[0]}
                alt=""
                fill
                sizes="220px"
                unoptimized
                className="object-cover"
              />
            ) : null}
          </div>
          <a
            href={proposal.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-berry-700 hover:text-brown-900"
          >
            <Icon name="instagram" size={16} />
            Ver la publicación
          </a>
          <details className="text-sm">
            <summary className="cursor-pointer text-brown-700">Caption original</summary>
            <p className="mt-2 whitespace-pre-line text-brown-500">{proposal.caption || "(sin texto)"}</p>
          </details>
        </div>

        {/* ------------------------------------------------ la propuesta */}
        <div className="flex flex-col gap-4">
          {proposal.error ? (
            <div className="fp-alert fp-alert--error">
              <Icon name="alert" size={18} className="mt-px shrink-0" />
              <p>
                No se pudo leer la publicación automáticamente ({proposal.error}). Cargala a mano con
                el caption de al lado.
              </p>
            </div>
          ) : null}

          {proposal.warnings.length ? (
            <div className="fp-alert fp-alert--warn">
              <Icon name="alert" size={18} className="mt-px shrink-0" />
              <ul className="m-0 list-disc pl-4">
                {proposal.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="fp-label">Nombre</span>
              <input
                className="fp-input"
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                    slug: slugify(event.target.value),
                  }))
                }
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="fp-label">Categoría</span>
              <select
                className="fp-input"
                value={draft.category}
                onChange={(event) => setDraft((c) => ({ ...c, category: event.target.value }))}
              >
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="fp-label">Resumen</span>
            <input
              className="fp-input"
              value={draft.summary}
              onChange={(event) => setDraft((c) => ({ ...c, summary: event.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="fp-label">Descripción</span>
            <textarea
              className="fp-input"
              rows={3}
              value={draft.description}
              onChange={(event) => setDraft((c) => ({ ...c, description: event.target.value }))}
            />
          </label>

          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
            <legend className="fp-label p-0">Opciones y precios</legend>
            {draft.variants.map((variant, index) => (
              <div key={index} className="grid gap-3 sm:grid-cols-[1fr_130px]">
                <input
                  className="fp-input"
                  aria-label={`Etiqueta de la opción ${index + 1}`}
                  value={variant.label}
                  onChange={(event) =>
                    setDraft((c) => ({
                      ...c,
                      variants: c.variants.map((item, position) =>
                        position === index ? { ...item, label: event.target.value } : item,
                      ),
                    }))
                  }
                />
                <input
                  className="fp-input tnum"
                  type="number"
                  min={0}
                  placeholder="Consultar"
                  aria-label={`Precio de la opción ${index + 1}`}
                  value={variant.price ?? ""}
                  onChange={(event) =>
                    setDraft((c) => ({
                      ...c,
                      variants: c.variants.map((item, position) =>
                        position === index
                          ? {
                              ...item,
                              price: event.target.value === "" ? null : Number(event.target.value),
                            }
                          : item,
                      ),
                    }))
                  }
                />
              </div>
            ))}
            <p className="fp-help">
              {draft.variants.some((variant) => variant.price !== null)
                ? draft.variants
                    .filter((variant) => variant.price !== null)
                    .map((variant) => `${variant.label}: ${formatPrice(variant.price!)}`)
                    .join(" · ")
                : "Sin precio: se va a mostrar como Consultar."}
            </p>
          </fieldset>

          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
            <legend className="fp-label p-0">Texto alternativo de las fotos</legend>
            {draft.images.map((image, index) => (
              <div key={index} className="grid gap-3 sm:grid-cols-[64px_1fr] sm:items-center">
                <span className="relative h-16 w-16 overflow-hidden rounded-lg bg-cream-300">
                  {image.src ? (
                    <Image src={image.src} alt="" fill sizes="64px" unoptimized className="object-cover" />
                  ) : null}
                </span>
                <input
                  className="fp-input"
                  placeholder="Qué se ve en la foto"
                  aria-label={`Texto alternativo de la foto ${index + 1}`}
                  value={image.alt}
                  onChange={(event) =>
                    setDraft((c) => ({
                      ...c,
                      images: c.images.map((item, position) =>
                        position === index ? { ...item, alt: event.target.value } : item,
                      ),
                    }))
                  }
                />
              </div>
            ))}
          </fieldset>

          {error ? (
            <p className="fp-alert fp-alert--error" role="alert">
              <Icon name="alert" size={18} className="mt-px shrink-0" />
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 border-t border-line-200 pt-4">
            <button
              type="button"
              className="fp-btn fp-btn--primary"
              onClick={aprobar}
              disabled={busy !== null || !draft.name.trim()}
            >
              {busy === "aprobar" ? "Publicando…" : "Publicar en el catálogo"}
            </button>
            <button
              type="button"
              className="fp-btn fp-btn--ghost"
              onClick={descartar}
              disabled={busy !== null}
            >
              Descartar
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
