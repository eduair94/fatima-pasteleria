import { NextResponse } from "next/server";

import { runSync } from "@/lib/sync";

/**
 * Corrida diaria. La dispara Vercel Cron según `vercel.json`, firmando la
 * llamada con CRON_SECRET.
 *
 * Sin esa variable la ruta no atiende a nadie. Es a propósito: una corrida
 * gasta crédito del scraper y cuota de Gemini, así que un endpoint abierto es
 * una forma de que un tercero te vacíe la cuenta. El botón del panel sigue
 * funcionando igual, con sesión.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();

  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Falta CRON_SECRET. Definila en las variables de entorno para habilitar la corrida diaria.",
      },
      { status: 503 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const report = await runSync();
  return NextResponse.json({ report }, { status: report.error ? 502 : 200 });
}
