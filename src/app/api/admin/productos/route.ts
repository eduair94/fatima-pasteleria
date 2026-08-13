import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { readCatalog, saveProducts } from "@/lib/store";
import { ValidationError, parseProduct } from "@/lib/validate";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
}

function refresh() {
  revalidatePath("/", "layout");
}

/** Todos los productos, incluidos los pausados. */
export async function GET() {
  if (!(await isAuthenticated())) return unauthorized();
  const { products, settings } = await readCatalog({ fresh: true });
  return NextResponse.json({ products, settings });
}

/** Alta de un producto. */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();

  try {
    const { products } = await readCatalog({ fresh: true });
    const product = parseProduct(await request.json());

    if (products.some((p) => p.slug === product.slug)) {
      return NextResponse.json(
        { error: `Ya hay un producto con la dirección "${product.slug}".`, field: "slug" },
        { status: 409 },
      );
    }

    const id = products.some((p) => p.id === product.id)
      ? `${product.id}-${Date.now().toString(36)}`
      : product.id;

    await saveProducts([...products, { ...product, id }]);
    refresh();

    return NextResponse.json({ product: { ...product, id } }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message, field: error.field }, { status: 422 });
    }
    console.error("[admin] alta de producto", error);
    return NextResponse.json({ error: "No se pudo guardar el producto." }, { status: 500 });
  }
}

/** Reordenamiento masivo: [{ id, order, category }]. */
export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();

  try {
    const body = (await request.json()) as { order?: { id: string; order: number }[] };
    if (!Array.isArray(body.order)) {
      return NextResponse.json({ error: "Falta el nuevo orden." }, { status: 422 });
    }

    const { products } = await readCatalog({ fresh: true });
    const positions = new Map(body.order.map((item) => [item.id, Number(item.order)]));

    await saveProducts(
      products.map((product) =>
        positions.has(product.id) ? { ...product, order: positions.get(product.id)! } : product,
      ),
    );
    refresh();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin] reordenar", error);
    return NextResponse.json({ error: "No se pudo cambiar el orden." }, { status: 500 });
  }
}
