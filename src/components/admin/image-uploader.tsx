"use client";

import { upload } from "@vercel/blob/client";
import { useId, useRef, useState } from "react";

import { Icon } from "@/components/icon";
import { formatBytes, resizeImage } from "@/lib/resize-image";

type Estado =
  | { fase: "listo" }
  | { fase: "preparando" }
  | { fase: "subiendo"; progreso: number }
  | { fase: "error"; mensaje: string };

/**
 * Sube una foto al Blob del proyecto y devuelve su URL pública. El archivo va
 * del navegador al Blob directo; el servidor sólo firma el permiso.
 */
export function ImageUploader({
  onUploaded,
  disponible,
  compacto = false,
}: {
  onUploaded: (url: string) => void;
  disponible: boolean;
  compacto?: boolean;
}) {
  const [estado, setEstado] = useState<Estado>({ fase: "listo" });
  const [detalle, setDetalle] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();

  async function subir(file: File) {
    setDetalle(null);
    setEstado({ fase: "preparando" });

    const { file: listo, width, height, reduced } = await resizeImage(file);
    if (reduced) {
      setDetalle(`${width} × ${height} · ${formatBytes(listo.size)}`);
    } else {
      setDetalle(formatBytes(listo.size));
    }

    setEstado({ fase: "subiendo", progreso: 0 });

    try {
      const blob = await upload(`fotos/${listo.name}`, listo, {
        access: "public",
        handleUploadUrl: "/api/admin/imagenes",
        contentType: listo.type,
        onUploadProgress: ({ percentage }) =>
          setEstado({ fase: "subiendo", progreso: Math.round(percentage) }),
      });

      onUploaded(blob.url);
      setEstado({ fase: "listo" });
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : "No se pudo subir la foto. Probá de nuevo.";
      setEstado({ fase: "error", mensaje });
    }
  }

  if (!disponible) {
    return (
      <p className="fp-help">
        Para subir fotos desde el teléfono hace falta conectar un store de Blob al proyecto. Mientras
        tanto, se puede pegar una ruta o una URL.
      </p>
    );
  }

  const ocupado = estado.fase === "preparando" || estado.fase === "subiendo";

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void subir(file);
        }}
      />

      <button
        type="button"
        className={`fp-btn fp-btn--ghost ${compacto ? "fp-btn--sm" : ""} w-fit`}
        disabled={ocupado}
        onClick={() => input.current?.click()}
      >
        <Icon name={ocupado ? "loader" : "image"} size={16} className={ocupado ? "animate-spin" : ""} />
        {estado.fase === "preparando"
          ? "Preparando…"
          : estado.fase === "subiendo"
            ? `Subiendo ${estado.progreso}%`
            : "Subir foto"}
      </button>

      {estado.fase === "subiendo" ? (
        <div
          className="h-1 w-full max-w-[16rem] overflow-hidden rounded-full bg-cream-300"
          role="progressbar"
          aria-valuenow={estado.progreso}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso de la subida"
        >
          <div
            className="h-full bg-berry-700 transition-[width] duration-200"
            style={{ width: `${estado.progreso}%` }}
          />
        </div>
      ) : null}

      {estado.fase === "error" ? (
        <p className="fp-error" role="alert">
          <Icon name="alert" size={16} className="shrink-0" />
          {estado.mensaje}
        </p>
      ) : detalle && !ocupado ? (
        <p className="fp-help">Última foto subida: {detalle}</p>
      ) : detalle ? (
        <p className="fp-help">{detalle}</p>
      ) : null}
    </div>
  );
}
