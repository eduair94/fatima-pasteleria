import { NextResponse } from "next/server";

import {
  adminIsConfigured,
  clearAttempts,
  endSession,
  isAuthenticated,
  registerFailedAttempt,
  startSession,
  tooManyAttempts,
  usingDerivedSecret,
  verifyPassword,
} from "@/lib/auth";
import { storeDriver, storeIsDurable } from "@/lib/store";

export const dynamic = "force-dynamic";

function clientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

/** Estado de la sesión y del almacenamiento, para que el panel avise. */
export async function GET() {
  return NextResponse.json({
    authenticated: await isAuthenticated(),
    configured: adminIsConfigured(),
    derivedSecret: usingDerivedSecret(),
    driver: storeDriver(),
    durable: storeIsDurable(),
  });
}

export async function POST(request: Request) {
  const key = clientKey(request);

  if (!adminIsConfigured()) {
    return NextResponse.json(
      {
        error:
          "El panel no tiene contraseña configurada. Definí ADMIN_PASSWORD en las variables de entorno.",
        configured: false,
      },
      { status: 503 },
    );
  }

  if (tooManyAttempts(key)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Probá de nuevo en unos minutos." },
      { status: 429 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "No se pudo leer el formulario." }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    registerFailedAttempt(key);
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  clearAttempts(key);
  await startSession();

  return NextResponse.json({
    ok: true,
    driver: storeDriver(),
    durable: storeIsDurable(),
    derivedSecret: usingDerivedSecret(),
  });
}

export async function DELETE() {
  await endSession();
  return NextResponse.json({ ok: true });
}
