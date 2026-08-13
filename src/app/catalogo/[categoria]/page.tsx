import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogView } from "@/components/catalog-view";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { CATEGORIES, SITE, categoryName } from "@/lib/site";
import { readCatalog } from "@/lib/store";

/**
 * Cada grupo tiene su propia URL estática. Antes eran `?categoria=`, que
 * obligaba a leer `searchParams` y volvía dinámica toda la página.
 */

export const revalidate = 120;
export const dynamicParams = false;

type Params = Promise<{ categoria: string }>;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ categoria: category.id }));
}

/** Bajada propia por grupo, para que cada URL diga algo distinto. */
const DESCRIPTIONS: Record<string, string> = {
  cheesecakes:
    "Cheesecakes caseros por encargo en Montevideo: base de galletitas crocante y relleno cremoso, enteros o por porción. Con 48 hs de anticipación, envío $ 100 en zona o retiro sin costo. Pedidos por WhatsApp.",
  tortas:
    "Tortas y tartas por encargo en Montevideo: carrot cake, lemon pie con merengue a soplete, torta de frutillas y tiramisú. Armadas el día de la entrega, con 48 hs de anticipación. Envío o retiro sin costo.",
  galleteria:
    "Scones de queso, alfajores de maicena y brownies caseros por encargo en Montevideo. Horneados en tandas chicas, con 48 hs de anticipación. Envío $ 100 en zona o retiro sin costo en Aguada y La Comercial.",
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { categoria } = await params;
  const category = CATEGORIES.find((c) => c.id === categoria);
  if (!category) return { title: "Grupo no encontrado" };

  const description = DESCRIPTIONS[category.id];
  const path = `/catalogo/${category.id}`;

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

export default async function CategoryPage({ params }: { params: Params }) {
  const { categoria } = await params;
  if (!CATEGORIES.some((c) => c.id === categoria)) notFound();

  const { products, settings } = await readCatalog();
  const items = products.filter((product) => product.category === categoria);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Catálogo", path: "/catalogo" },
            { name: categoryName(categoria), path: `/catalogo/${categoria}` },
          ]),
          itemListJsonLd(items),
        ]}
      />
      <CatalogView products={products} settings={settings} active={categoria} />
    </>
  );
}
