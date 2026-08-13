import Link from "next/link";

import { Icon } from "@/components/icon";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/format";
import { lowestPrice } from "@/lib/product";
import { CATEGORIES, SITE, ZONES, categoryName } from "@/lib/site";
import type { Product, Settings } from "@/lib/types";
import { waConsultLink } from "@/lib/whatsapp";

/**
 * Vista del catálogo, compartida entre `/catalogo` y `/catalogo/<categoría>`.
 *
 * Las dos son rutas estáticas. Antes había una sola que leía `searchParams`,
 * lo que la volvía dinámica: se renderizaba entera en cada visita, sin caché
 * de CDN, justo en la página de mayor intención de compra.
 */

/** Bajada propia de cada grupo, con hechos que la cuenta ya publica. */
const INTRO: Record<string, string> = {
  cheesecakes:
    "Base de galletitas bien crocante y relleno cremoso, horneado por encargo. Se puede pedir entero para una mesa o por porción para probar.",
  tortas:
    "Tortas y tartas armadas el día de la entrega: bizcochuelo esponjoso, frutas frescas cortadas al momento y merengue dorado a soplete. Enteras o por porción, según el producto.",
  galleteria:
    "Lo que sale del horno en tandas chicas: scones de queso, alfajores de maicena armados de a uno y brownies de chocolate. Ideal para acompañar el mate o llevar a una reunión.",
};

export function CatalogView({
  products,
  settings,
  active,
}: {
  products: Product[];
  settings: Settings;
  active?: string;
}) {
  const filtered = active ? products.filter((product) => product.category === active) : products;
  const grouped = CATEGORIES.map((category) => ({
    category,
    items: filtered.filter((product) => product.category === category.id),
  })).filter((group) => group.items.length > 0);

  const precios = filtered
    .map((product) => lowestPrice(product))
    .filter((price): price is number => price !== null);

  const zonas = ZONES.filter((zone) => zone.cost !== null)
    .map((zone) => zone.name)
    .join(", ");

  return (
    <>
      <div className="wrap flex flex-col gap-6 pt-8 pb-4">
        <nav aria-label="Miga de pan" className="text-xs text-brown-500">
          <Link href="/" className="text-brown-500 no-underline hover:text-brown-900">
            Inicio
          </Link>
          <span aria-hidden="true"> / </span>
          {active ? (
            <>
              <Link href="/catalogo" className="text-brown-500 no-underline hover:text-brown-900">
                Catálogo
              </Link>
              <span aria-hidden="true"> / </span>
              <span className="text-brown-900">{categoryName(active)}</span>
            </>
          ) : (
            <span className="text-brown-900">Catálogo</span>
          )}
        </nav>

        <div className="flex flex-col gap-3">
          <h1 className="t-h1">
            {active ? `${categoryName(active)} por encargo` : "Catálogo"}
          </h1>

          {/* La respuesta completa a "dónde pido esto en Montevideo", en texto
              visible y no sólo en los metadatos. */}
          <p className="prose-fp text-[16px]">
            {active ? INTRO[active] : null}{" "}
            {precios.length ? (
              <>
                Desde {formatPrice(Math.min(...precios))}, hecho a mano en {SITE.city} con{" "}
                {settings.leadTimeHours} hs de anticipación.
              </>
            ) : (
              <>Hecho a mano en {SITE.city}, por encargo.</>
            )}{" "}
            Envío {formatPrice(settings.shippingCost)} a {zonas}, o retiro sin costo en{" "}
            {SITE.neighborhoods}. El pedido se cierra por WhatsApp.
          </p>
        </div>
      </div>

      {/* Son enlaces a otra página, no botones de alternancia: `aria-pressed`
          no está permitido en un <a>. Lo que corresponde acá es `aria-current`,
          que además se anuncia como «página actual». */}
      <nav
        aria-label="Categorías"
        className="no-scrollbar sticky top-14 z-40 overflow-x-auto border-b border-line-200 bg-cream-100/95 py-3 backdrop-blur-sm md:top-[72px]"
      >
        <div className="wrap flex gap-2">
          <Link
            href="/catalogo"
            aria-current={active ? undefined : "page"}
            className="fp-chip shrink-0 no-underline"
          >
            Todo
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/catalogo/${category.id}`}
              aria-current={active === category.id ? "page" : undefined}
              className="fp-chip shrink-0 no-underline"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="wrap flex flex-col gap-14 py-10 pb-24 md:gap-20">
        {grouped.length === 0 ? (
          <EmptyState />
        ) : (
          grouped.map((group) => (
            <section key={group.category.id} aria-labelledby={`grupo-${group.category.id}`}>
              <div className="mb-6 flex items-baseline gap-4">
                <h2 id={`grupo-${group.category.id}`} className="t-h2">
                  {active ? "Qué hay" : group.category.name}
                </h2>
                <hr className="rule-gold flex-1" />
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {group.items.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 2} />
                ))}
              </div>
            </section>
          ))
        )}

        {active ? (
          <p className="text-sm text-brown-500">
            {/* Va subrayado porque es el único enlace que cae dentro de texto
                corrido: contra el marrón que lo rodea el contraste es 1.04:1 y
                el color solo no alcanza para distinguirlo. */}
            <Link
              href="/catalogo"
              className="text-berry-700 underline underline-offset-2 hover:text-brown-900"
            >
              Ver todo el catálogo
            </Link>{" "}
            · {CATEGORIES.filter((c) => c.id !== active).map((c) => c.name).join(" · ")}
          </p>
        ) : null}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[18px] border border-dashed border-line-300 bg-cream-50 px-6 py-14 text-center">
      <Icon name="cookie" size={26} className="text-brown-300" />
      <p className="t-h3">Por ahora no hay nada en este grupo</p>
      <p className="max-w-[24rem] text-sm leading-relaxed text-brown-500">
        Se hornea en cantidad limitada. Escribime y te aviso cuando vuelve.
      </p>
      <div className="mt-2 flex w-full max-w-[22rem] flex-col gap-2">
        <Link href="/catalogo" className="fp-btn fp-btn--ghost fp-btn--block">
          Ver todo el catálogo
        </Link>
        <a
          href={waConsultLink(SITE.whatsapp.e164)}
          target="_blank"
          rel="noopener noreferrer"
          className="fp-btn fp-btn--secondary fp-btn--block"
        >
          <Icon name="whatsapp" size={18} />
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
