import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { getSettings, resetCatalog, saveSettings } from "@/lib/store";
import { ValidationError, parseSettings } from "@/lib/validate";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
}

export async function GET() {
  if (!(await isAuthenticated())) return unauthorized();
  return NextResponse.json({ settings: await getSettings() });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return unauthorized();

  try {
    const settings = parseSettings(await request.json(), await getSettings());
    await saveSettings(settings);
    revalidatePath("/", "layout");
    return NextResponse.json({ settings });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message, field: error.field }, { status: 422 });
    }
    console.error("[admin] ajustes", error);
    return NextResponse.json({ error: "No se pudieron guardar los ajustes." }, { status: 500 });
  }
}

/** Vuelve el catálogo al estado publicado en Instagram al 12/08/2026. */
export async function DELETE() {
  if (!(await isAuthenticated())) return unauthorized();
  await resetCatalog();
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
