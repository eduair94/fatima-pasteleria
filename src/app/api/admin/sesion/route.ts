import { NextResponse } from "next/server";

import {
  clearAttempts,
  endSession,
  isAuthenticated,
  registerFailedAttempt,
  startSession,
  tooManyAttempts,
  usingDefaultPassword,
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
    driver: storeDriver(),
    durable: storeIsDurable(),
    defaultPassword: usingDefaultPassword(),
  });
}

export async function POST(request: Request) {
  const key = clientKey(request);

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
    defaultPassword: usingDefaultPassword(),
  });
}

export async function DELETE() {
  await endSession();
  return NextResponse.json({ ok: true });
}
