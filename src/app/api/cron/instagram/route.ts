import { NextResponse } from "next/server";

import { runSync } from "@/lib/sync";

/**
 * Corrida diaria. La dispara Vercel Cron según `vercel.json`.
 *
 * Vercel firma sus llamadas con CRON_SECRET; si la variable está definida, no
 * se atiende a nadie más. Sin la variable, la ruta queda abierta, así que el
 * README insiste en cargarla.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();

  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const report = await runSync();
  return NextResponse.json({ report }, { status: report.error ? 502 : 200 });
}
