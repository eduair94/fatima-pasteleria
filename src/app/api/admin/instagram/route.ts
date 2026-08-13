import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { fetchLatestPosts } from "@/lib/instagram";
import { readCatalog } from "@/lib/store";
import { runSync, syncStatus } from "@/lib/sync";

export const dynamic = "force-dynamic";
/** El proveedor puede tardar; se le da todo el margen del plan. */
export const maxDuration = 60;

function unauthorized() {
  return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
}

/** Estado de la sincronización y resultado de la última corrida. */
export async function GET() {
  if (!(await isAuthenticated())) return unauthorized();

  const { proposals, lastSync, pendingJob } = await readCatalog({ fresh: true });
  return NextResponse.json({
    status: syncStatus(),
    lastSync: lastSync ?? null,
    pending: proposals?.length ?? 0,
    running: Boolean(pendingJob),
  });
}

/**
 * Busca novedades. Se puede llamar varias veces: si el scraper todavía está
 * corriendo, devuelve `pendiente` en lugar de arrancar otro. El panel vuelve a
 * llamar cada pocos segundos hasta que termina.
 */
export async function POST() {
  if (!(await isAuthenticated())) return unauthorized();

  const outcome = await runSync();

  if (outcome.state === "pendiente") {
    return NextResponse.json({ state: "pendiente", startedAt: outcome.startedAt }, { status: 202 });
  }

  revalidatePath("/admin");
  return NextResponse.json(
    { state: "listo", report: outcome.report },
    { status: outcome.report.error ? 502 : 200 },
  );
}

/**
 * Prueba de conexión: trae las publicaciones y devuelve lo que entendió, sin
 * llamar al modelo ni guardar nada. Sirve para ajustar RAPIDAPI_PATH sin
 * gastar cuota de Gemini.
 */
export async function PUT() {
  if (!(await isAuthenticated())) return unauthorized();

  const status = syncStatus();
  if (!status.configured) {
    return NextResponse.json(
      { error: `Falta configurar ${status.missing.join(", ") || "el proveedor"}.` },
      { status: 422 },
    );
  }

  try {
    const posts = await fetchLatestPosts(status.username, 3);
    return NextResponse.json({
      provider: status.active,
      username: status.username,
      count: posts.length,
      posts: posts.map((post) => ({
        shortcode: post.shortcode,
        url: post.url,
        postedAt: post.postedAt,
        fotos: post.imageUrls.length,
        caption: post.caption.slice(0, 160),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo leer Instagram." },
      { status: 502 },
    );
  }
}
