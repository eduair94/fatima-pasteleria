import { NextResponse } from "next/server";

import { readCatalog } from "@/lib/store";

/**
 * Catálogo público. Devuelve sólo lo que un cliente necesita para armar un
 * pedido. Es la misma fuente que consumen las páginas, así que nunca se
 * desincroniza con lo que se ve en pantalla.
 *
 * GET /api/productos
 * GET /api/productos?categoria=cheesecakes
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { products, settings } = await readCatalog();
  const category = new URL(request.url).searchParams.get("categoria");

  const visible = products
    .filter((product) => (category ? product.category === category : true))
    .sort((a, b) => (a.category === b.category ? a.order - b.order : a.category.localeCompare(b.category)));

  return NextResponse.json(
    {
      products: visible,
      settings: {
        shippingCost: settings.shippingCost,
        leadTimeHours: settings.leadTimeHours,
        deliveryFromHour: settings.deliveryFromHour,
        whatsappE164: settings.whatsappE164,
        whatsappDisplay: settings.whatsappDisplay,
        announcement: settings.announcement,
      },
      count: visible.length,
      updatedAt: settings.updatedAt,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
