import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { CATEGORIES, SITE, categoryName } from "@/lib/site";
import { readCatalog } from "@/lib/store";
import { waConsultLink } from "@/lib/whatsapp";

export const revalidate = 120;

type Search = Promise<{ categoria?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  const { categoria } = await searchParams;
  const category = CATEGORIES.find((c) => c.id === categoria);

  // El `openGraph.url` va explícito: sin él hereda el del layout raíz y
  // compartir un enlace de categoría muestra la vista previa de la portada.
  if (category) {
    const path = `/catalogo?categoria=${category.id}`;
    const description = `${category.name} caseros de Fátima — Pastelería Artesanal. Por encargo en Montevideo con 48 hs de anticipación, envío o retiro sin costo. Pedidos por WhatsApp.`;

    return {
      title: `${category.name} por encargo en Montevideo`,
      description,
      alternates: { canonical: path },
      openGraph: {
        title: `${category.name} por encargo en Montevideo | Fátima`,
        description,
        url: `${SITE.url}${path}`,
      },
    };
  }

  const description =
    "Todo lo que se puede pedir: cheesecakes, tortas y tartas, scones y galletería. Hecho a mano en Montevideo, por encargo con 48 hs de anticipación. Precios publicados y pedido por WhatsApp.";

  return {
    title: "Catálogo de tortas, cheesecakes y scones caseros",
    description,
    alternates: { canonical: "/catalogo" },
    openGraph: {
      title: "Catálogo de tortas, cheesecakes y scones caseros | Fátima",
      description,
      url: `${SITE.url}/catalogo`,
    },
  };
}

export default async function CatalogPage({ searchParams }: { searchParams: Search }) {
  const { categoria } = await searchParams;
  const { products } = await readCatalog();

  const active = CATEGORIES.find((c) => c.id === categoria)?.id ?? null;
  const filtered = active ? products.filter((product) => product.category === active) : products;
  const grouped = CATEGORIES.map((category) => ({
    category,
    items: filtered.filter((product) => product.category === category.id),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Catálogo", path: "/catalogo" },
            ...(active ? [{ name: categoryName(active), path: `/catalogo?categoria=${active}` }] : []),
          ]),
          itemListJsonLd(filtered),
        ]}
      />

      <div className="wrap flex flex-col gap-6 pt-8 pb-4">
        <nav aria-label="Miga de pan" className="text-xs text-brown-500">
          <Link href="/" className="text-brown-500 no-underline hover:text-brown-900">
            Inicio
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-brown-900">Catálogo</span>
          {active ? (
            <>
              <span aria-hidden="true"> / </span>
              <span className="text-brown-900">{categoryName(active)}</span>
            </>
          ) : null}
        </nav>

        <div className="flex flex-col gap-3">
          <h1 className="t-h1">{active ? categoryName(active) : "Catálogo"}</h1>
          <p className="prose-fp text-[16px]">
            Todo se hace por encargo, con 48 hs de anticipación. Los precios son los publicados en
            Instagram; lo que no tiene precio se coordina por WhatsApp.
          </p>
        </div>
      </div>

      <div className="no-scrollbar sticky top-14 z-40 overflow-x-auto border-b border-line-200 bg-cream-100/95 py-3 backdrop-blur-sm md:top-[72px]">
        <div className="wrap flex gap-2">
          <Link href="/catalogo" aria-pressed={!active} className="fp-chip shrink-0 no-underline">
            Todo
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/catalogo?categoria=${category.id}`}
              aria-pressed={active === category.id}
              className="fp-chip shrink-0 no-underline"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="wrap flex flex-col gap-14 py-10 pb-24 md:gap-20">
        {grouped.length === 0 ? (
          <EmptyState />
        ) : (
          grouped.map((group) => (
            <section key={group.category.id} aria-labelledby={`grupo-${group.category.id}`}>
              <div className="mb-6 flex items-baseline gap-4">
                <h2 id={`grupo-${group.category.id}`} className="t-h2">
                  {group.category.name}
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
