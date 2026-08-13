import Link from "next/link";

import { Icon } from "@/components/icon";
import { SITE } from "@/lib/site";
import { waConsultLink } from "@/lib/whatsapp";

export default function NotFound() {
  return (
    <div className="wrap flex max-w-[34rem] flex-col items-center gap-4 py-24 text-center">
      <Icon name="cookie" size={30} className="text-brown-300" />
      <h1 className="t-h1">Esta página no existe</h1>
      <p className="leading-relaxed text-brown-700">
        Puede que el producto ya no esté en el catálogo. Mirá lo que hay disponible o escribime y te
        cuento.
      </p>
      <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link href="/catalogo" className="fp-btn fp-btn--primary fp-btn--lg fp-btn--block sm:w-auto!">
          Ver catálogo
        </Link>
        <a
          href={waConsultLink(SITE.whatsapp.e164)}
          target="_blank"
          rel="noopener noreferrer"
          className="fp-btn fp-btn--ghost fp-btn--lg fp-btn--block sm:w-auto!"
        >
          <Icon name="whatsapp" size={18} />
          Escribir por WhatsApp
        </a>
      </div>
    </div>
  );
}
