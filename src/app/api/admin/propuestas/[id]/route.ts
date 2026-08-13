import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { copyImageToBlob } from "@/lib/blob-images";
import { slugify } from "@/lib/format";
import { readCatalog, saveProposals, writeCatalog } from "@/lib/store";
import { ValidationError, parseProduct } from "@/lib/validate";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function unauthorized() {
  return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
}

/**
 * Aprueba una propuesta y la publica como producto.
 *
 * El cuerpo lleva el producto tal como quedó tras la revisión en el panel: se
 * valida igual que cualquier alta manual, así que nada entra sin pasar por el
 * mismo control. Las fotos se copian al Blob porque las de Instagram caducan.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return unauthorized();

  const { id } = await params;
  const catalog = await readCatalog({ fresh: true });
  const proposals = catalog.proposals ?? [];
  const proposal = proposals.find((item) => item.id === id);

  if (!proposal) {
    return NextResponse.json({ error: "Esa propuesta ya no está." }, { status: 404 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = parseProduct({ ...proposal.draft, ...body });

    if (catalog.products.some((item) => item.slug === product.slug)) {
      return NextResponse.json(
        { error: `Ya hay un producto con la dirección "${product.slug}".`, field: "slug" },
        { status: 409 },
      );
    }

    // Las fotos de Instagram caducan: se copian al Blob antes de publicar.
    const images = [];
    for (const [index, image] of product.images.entries()) {
      try {
        images.push({ ...image, src: await copyImageToBlob(image.src, product.slug, index) });
      } catch (error) {
        return NextResponse.json(
          {
            error: `No se pudo guardar la foto ${index + 1}: ${
              error instanceof Error ? error.message : "error al copiarla"
            }`,
          },
          { status: 502 },
        );
      }
    }

    const id_ = catalog.products.some((item) => item.id === product.id)
      ? `${product.id}-${Date.now().toString(36)}`
      : product.id || slugify(product.name);

    await writeCatalog({
      ...catalog,
      products: [...catalog.products, { ...product, id: id_, images }],
      proposals: proposals.filter((item) => item.id !== id),
    });
    revalidatePath("/", "layout");

    return NextResponse.json({ product: { ...product, id: id_, images } }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message, field: error.field }, { status: 422 });
    }
    console.error("[admin] aprobar propuesta", error);
    return NextResponse.json({ error: "No se pudo publicar el producto." }, { status: 500 });
  }
}

/** Descarta la propuesta. La publicación no se vuelve a proponer. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return unauthorized();

  const { id } = await params;
  const proposals = (await readCatalog({ fresh: true })).proposals ?? [];

  if (!proposals.some((item) => item.id === id)) {
    return NextResponse.json({ error: "Esa propuesta ya no está." }, { status: 404 });
  }

  await saveProposals(proposals.filter((item) => item.id !== id));
  revalidatePath("/admin");

  return NextResponse.json({ ok: true });
}
