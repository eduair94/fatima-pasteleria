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

  // El scraper tarda más de lo que dura esta función, así que se arranca y se
  // espera un rato. Lo que no llegue a terminar lo recolecta la corrida de
  // mañana antes de arrancar una nueva.
  const deadline = Date.now() + 45_000;
  let outcome = await runSync();

  while (outcome.state === "pendiente" && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    outcome = await runSync();
  }

  if (outcome.state === "pendiente") {
    return NextResponse.json(
      { state: "pendiente", nota: "Se recolecta en la próxima corrida." },
      { status: 202 },
    );
  }

  return NextResponse.json(
    { state: "listo", report: outcome.report },
    { status: outcome.report.error ? 502 : 200 },
  );
}
