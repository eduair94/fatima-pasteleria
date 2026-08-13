import "server-only";

import { blobIsAvailable } from "./store";

/**
 * Copia una foto de Instagram al Blob del proyecto.
 *
 * Hace falta porque las URLs que devuelve Instagram caducan en días: si se
 * guardara la URL del proveedor, el producto quedaría sin foto al poco tiempo.
 */

const MAX_BYTES = 8 * 1024 * 1024;

export async function copyImageToBlob(url: string, slug: string, index: number): Promise<string> {
  if (!blobIsAvailable()) return url;
  if (!/^https:\/\//.test(url)) return url;

  // Ya está en nuestro Blob: no se vuelve a copiar.
  if (/\.public\.blob\.vercel-storage\.com\//.test(url)) return url;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`No se pudo bajar la foto (${response.status}).`);

  const type = response.headers.get("content-type") ?? "image/jpeg";
  if (!type.startsWith("image/")) throw new Error("Esa dirección no devuelve una imagen.");

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_BYTES) throw new Error("La foto pesa demasiado.");

  const extension = type.split("/")[1]?.split(";")[0]?.replace("jpeg", "jpg") ?? "jpg";
  const { put } = await import("@vercel/blob");

  const blob = await put(`fotos/${slug}-${index + 1}.${extension}`, buffer, {
    access: "public",
    contentType: type,
    addRandomSuffix: true,
  });

  return blob.url;
}
