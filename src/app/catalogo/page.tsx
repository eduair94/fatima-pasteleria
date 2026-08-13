import type { Metadata } from "next";

import { CatalogView } from "@/components/catalog-view";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";
import { readCatalog } from "@/lib/store";

export const revalidate = 120;

const DESCRIPTION =
  "Todo lo que se puede pedir: cheesecakes, tortas y tartas, scones y galletería. Hecho a mano en Montevideo, por encargo con 48 hs de anticipación. Envío $ 100 en zona o retiro sin costo. Precios publicados y pedido por WhatsApp.";

export const metadata: Metadata = {
  title: "Catálogo de tortas, cheesecakes y scones caseros",
  description: DESCRIPTION,
  alternates: { canonical: "/catalogo" },
  openGraph: {
    title: "Catálogo de tortas, cheesecakes y scones caseros | Fátima",
    description: DESCRIPTION,
    url: `${SITE.url}/catalogo`,
  },
};

export default async function CatalogPage() {
  const { products, settings } = await readCatalog();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Catálogo", path: "/catalogo" },
          ]),
          itemListJsonLd(products),
        ]}
      />
      <CatalogView products={products} settings={settings} />
    </>
  );
}
