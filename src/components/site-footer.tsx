import Link from "next/link";

import { Icon } from "@/components/icon";
import { Wordmark } from "@/components/wordmark";
import { SITE, ZONES } from "@/lib/site";
import type { Settings } from "@/lib/types";
import { waConsultLink } from "@/lib/whatsapp";

export function SiteFooter({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  const zones = ZONES.filter((zone) => zone.cost !== null)
    .map((zone) => zone.name)
    .join(", ");

  return (
    <footer className="bg-brown-900 pb-24 text-cream-50 md:pb-0">
      <div className="wrap grid gap-10 py-14 md:grid-cols-3 md:py-16">
        <div className="flex flex-col gap-4">
          <Wordmark href={null} inverse size={26} className="items-start!" />
          <p className="max-w-[24rem] text-sm leading-relaxed text-cream-50/85">
            {SITE.motto} Cheesecakes, scones y tortas caseras por encargo en {SITE.city}.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="eyebrow text-gold-200!">Contacto</h2>
          <a
            href={waConsultLink(settings.whatsappE164)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-cream-50 no-underline hover:text-gold-200"
          >
            <Icon name="whatsapp" size={16} />
            {settings.whatsappDisplay}
          </a>
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-cream-50 no-underline hover:text-gold-200"
          >
            <Icon name="instagram" size={16} />
            {SITE.instagram.handle}
          </a>
          <p className="flex items-center gap-2 text-sm text-cream-50/85">
            <Icon name="map-pin" size={16} />
            {SITE.neighborhoods}, {SITE.city}
          </p>
          <p className="flex items-center gap-2 text-sm text-cream-50/85">
            <Icon name="clock" size={16} />
            Entregas desde las {settings.deliveryFromHour} h
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="eyebrow text-gold-200!">Zonas de entrega</h2>
          <p className="text-sm leading-relaxed text-cream-50/85">{zones}.</p>
          <p className="text-sm leading-relaxed text-cream-50/85">
            Otras zonas de {SITE.city}, a coordinar. Retiro sin costo en {SITE.neighborhoods}.
          </p>
          <nav aria-label="Secciones" className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/catalogo" className="text-sm text-cream-50 no-underline hover:text-gold-200">
              Catálogo
            </Link>
            <Link href="/#preguntas" className="text-sm text-cream-50 no-underline hover:text-gold-200">
              Preguntas
            </Link>
            <Link href="/admin" className="text-sm text-cream-50/70 no-underline hover:text-gold-200">
              Administrar
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-cream-50/15">
        <div className="wrap flex flex-col gap-3 py-6 text-xs leading-relaxed text-gold-200 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[34rem]">
            Los pedidos se coordinan por WhatsApp. El sitio arma el mensaje; la confirmación llega
            por ese medio. No se cobra nada en línea.
          </p>
          <p className="text-cream-50/70">
            © {year} {SITE.shortName}. Sitio por{" "}
            <a
              href={SITE.author.url}
              target="_blank"
              rel="noopener noreferrer me author"
              className="text-gold-200 underline underline-offset-2 hover:text-cream-50"
            >
              {SITE.author.name}
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
