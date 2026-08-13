import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { blobIsAvailable } from "@/lib/store";

/**
 * Subida de fotos a Vercel Blob.
 *
 * El archivo viaja del navegador al Blob directo, sin pasar por esta función:
 * acá sólo se firma un token de un solo uso después de verificar la sesión.
 * Es lo que evita el tope de 4,5 MB del cuerpo de una función serverless, que
 * cualquier foto de teléfono supera.
 */

export const dynamic = "force-dynamic";

const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  if (!blobIsAvailable()) {
    return NextResponse.json(
      { error: "No hay un store de Blob conectado al proyecto." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as HandleUploadBody;

    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await isAuthenticated())) {
          throw new Error("Sesión vencida. Volvé a entrar.");
        }
        return {
          allowedContentTypes: TIPOS,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
      // El aviso de subida terminada no se usa: el panel guarda la URL cuando
      // se guarda el producto. En desarrollo local Vercel ni siquiera puede
      // llamarlo, porque localhost no es alcanzable desde afuera.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo subir la foto.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/** Borra una foto del Blob. Sólo acepta URLs del propio store. */
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
  }

  const url = new URL(request.url).searchParams.get("url");
  if (!url || !/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//.test(url)) {
    return NextResponse.json({ error: "Esa foto no está en el Blob." }, { status: 422 });
  }

  try {
    await del(url);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin] borrar foto", error);
    return NextResponse.json({ error: "No se pudo borrar la foto." }, { status: 500 });
  }
}
