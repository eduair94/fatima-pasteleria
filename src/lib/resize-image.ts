/**
 * Reduce la foto en el navegador antes de subirla. Una foto de teléfono pesa
 * entre 3 y 8 MB y el sitio nunca la muestra a más de 1440 px: subirla entera
 * gasta almacenamiento y hace más lenta la primera carga del panel.
 *
 * Si algo falla —formato raro, canvas bloqueado— devuelve el archivo original:
 * es preferible una foto grande a una subida que no ocurre.
 */

const MAX_LADO = 1440;
const CALIDAD = 0.82;

export type ResizeResult = {
  file: File;
  width: number;
  height: number;
  reduced: boolean;
};

export async function resizeImage(file: File): Promise<ResizeResult> {
  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const escala = Math.min(1, MAX_LADO / Math.max(width, height));

    if (escala === 1 && file.size < 900_000) {
      bitmap.close();
      return { file, width, height, reduced: false };
    }

    const w = Math.round(width * escala);
    const h = Math.round(height * escala);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return { file, width, height, reduced: false };
    }

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", CALIDAD),
    );
    if (!blob || blob.size >= file.size) {
      return { file, width, height, reduced: false };
    }

    const nombre = file.name.replace(/\.[^.]+$/, "") || "foto";
    return {
      file: new File([blob], `${nombre}.webp`, { type: "image/webp" }),
      width: w,
      height: h,
      reduced: true,
    };
  } catch {
    return { file, width: 0, height: 0, reduced: false };
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
