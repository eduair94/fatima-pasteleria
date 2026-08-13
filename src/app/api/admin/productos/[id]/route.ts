import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { readCatalog, saveProducts } from "@/lib/store";
import { ValidationError, parseProduct } from "@/lib/validate";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
}

/** Edición completa de un producto. */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return unauthorized();

  const { id } = await params;

  try {
    const { products } = await readCatalog({ fresh: true });
    const existing = products.find((p) => p.id === id);
    if (!existing) return NextResponse.json({ error: "No existe ese producto." }, { status: 404 });

    const product = parseProduct(await request.json(), existing);

    if (products.some((p) => p.slug === product.slug && p.id !== id)) {
      return NextResponse.json(
        { error: `Ya hay otro producto con la dirección "${product.slug}".`, field: "slug" },
        { status: 409 },
      );
    }

    await saveProducts(products.map((p) => (p.id === id ? product : p)));
    revalidatePath("/", "layout");

    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message, field: error.field }, { status: 422 });
    }
    console.error("[admin] edición de producto", error);
    return NextResponse.json({ error: "No se pudo guardar el producto." }, { status: 500 });
  }
}

/** Cambios puntuales: precio de una opción, stock, orden, destacado. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return unauthorized();

  const { id } = await params;

  try {
    const { products } = await readCatalog({ fresh: true });
    const existing = products.find((p) => p.id === id);
    if (!existing) return NextResponse.json({ error: "No existe ese producto." }, { status: 404 });

    const patch = (await request.json()) as Record<string, unknown>;
    const merged = parseProduct({ ...existing, ...patch }, existing);

    await saveProducts(products.map((p) => (p.id === id ? merged : p)));
    revalidatePath("/", "layout");

    return NextResponse.json({ product: merged });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message, field: error.field }, { status: 422 });
    }
    console.error("[admin] cambio de producto", error);
    return NextResponse.json({ error: "No se pudo guardar el cambio." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return unauthorized();

  const { id } = await params;
  const { products } = await readCatalog({ fresh: true });

  if (!products.some((p) => p.id === id)) {
    return NextResponse.json({ error: "No existe ese producto." }, { status: 404 });
  }

  await saveProducts(products.filter((p) => p.id !== id));
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
