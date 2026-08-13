"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/icon";
import { Wordmark } from "@/components/wordmark";

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/sesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "No se pudo entrar.");
        setSending(false);
        return;
      }

      router.refresh();
    } catch {
      setError("No hay conexión. Probá de nuevo.");
      setSending(false);
    }
  }

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5 py-14">
        <div className="fp-card flex w-full max-w-[30rem] flex-col gap-5 p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Wordmark href={null} size={24} />
            <hr className="rule-gold" />
            <h1 className="t-h2 mt-1">Falta configurar el panel</h1>
          </div>

          <div className="fp-alert fp-alert--warn">
            <Icon name="lock" size={18} className="mt-px shrink-0" />
            <p>
              No hay contraseña definida, así que el panel no abre para nadie. La contraseña vive
              sólo en una variable de entorno: no está en el código.
            </p>
          </div>

          <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-brown-700">
            <li>
              En Vercel: <strong className="font-semibold">Settings → Environment Variables</strong>.
            </li>
            <li>
              Agregá <code className="rounded bg-cream-200 px-1">ADMIN_PASSWORD</code> con la
              contraseña que quieras.
            </li>
            <li>
              Agregá <code className="rounded bg-cream-200 px-1">ADMIN_SESSION_SECRET</code> con una
              cadena larga y aleatoria.
            </li>
            <li>Volvé a desplegar.</li>
          </ol>

          <p className="text-sm leading-relaxed text-brown-500">
            En desarrollo local, las mismas dos variables van en un archivo{" "}
            <code className="rounded bg-cream-200 px-1">.env.local</code>. Está en el README, sección
            &ldquo;Seguridad del panel&rdquo;.
          </p>

          <Link href="/" className="text-center text-sm text-berry-700 hover:text-brown-900">
            Volver al sitio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-14">
      <div className="fp-card flex w-full max-w-[26rem] flex-col gap-6 p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Wordmark href={null} size={24} />
          <hr className="rule-gold" />
          <h1 className="t-h2 mt-1">Panel de productos</h1>
          <p className="text-sm leading-relaxed text-brown-500">
            Desde acá se cambian precios, se pausa lo que no hay y se agregan productos nuevos.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={submit}>
          <div className="flex flex-col gap-2">
            <label className="fp-label" htmlFor="clave">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="clave"
                type={visible ? "text" : "password"}
                className="fp-input pr-12"
                value={password}
                autoComplete="current-password"
                autoFocus
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "error-clave" : undefined}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setVisible((value) => !value)}
                className="fp-iconbtn fp-iconbtn--sm absolute top-1/2 right-1.5 -translate-y-1/2 text-brown-500"
                aria-label={visible ? "Ocultar la contraseña" : "Mostrar la contraseña"}
              >
                <Icon name={visible ? "eye-off" : "eye"} size={18} />
              </button>
            </div>
            {error ? (
              <p className="fp-error" id="error-clave" role="alert">
                <Icon name="alert" size={16} className="shrink-0" />
                {error}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="fp-btn fp-btn--primary fp-btn--lg fp-btn--block"
            disabled={sending || password.length === 0}
          >
            {sending ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <Link href="/" className="text-center text-sm text-berry-700 hover:text-brown-900">
          Volver al sitio
        </Link>
      </div>
    </div>
  );
}
