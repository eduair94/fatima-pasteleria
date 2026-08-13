import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToOrder } from "@/components/add-to-order";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { formatPrice } from "@/lib/format";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/jsonld";
import { hasPrice, metaDescription, priceLabel } from "@/lib/product";
import { SITE, ZONES, categoryName } from "@/lib/site";
import { readCatalog } from "@/lib/store";

export const revalidate = 120;
export const dynamicParams = true;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const { products } = await readCatalog();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await readCatalog();
  const product = products.find((item) => item.slug === slug);

  if (!product) return { title: "Producto no encontrado" };

  const description = metaDescription(product);
  const image = product.images[0];

  return {
    title: `${product.name} por encargo en Montevideo`,
    description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      type: "article",
      title: `${product.name} — Fátima, Pastelería Artesanal`,
      description,
      url: `${SITE.url}/producto/${product.slug}`,
      images: image ? [{ url: image.src, alt: image.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Fátima, Pastelería Artesanal`,
      description,
      images: image ? [image.src] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const { products, settings } = await readCatalog();
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category && item.available)
    .slice(0, 4);

  const zones = ZONES.filter((zone) => zone.cost !== null)
    .map((zone) => zone.name)
    .join(", ");

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(product, settings),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Catálogo", path: "/catalogo" },
            { name: categoryName(product.category), path: `/catalogo/${product.category}` },
            { name: product.name, path: `/producto/${product.slug}` },
          ]),
        ]}
      />

      <article className="wrap py-8 pb-24">
        <nav aria-label="Miga de pan" className="mb-6 text-xs text-brown-500">
          <Link href="/" className="text-brown-500 no-underline hover:text-brown-900">
            Inicio
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/catalogo" className="text-brown-500 no-underline hover:text-brown-900">
            Catálogo
          </Link>
          <span aria-hidden="true"> / </span>
          <Link
            href={`/catalogo/${product.category}`}
            className="text-brown-500 no-underline hover:text-brown-900"
          >
            {categoryName(product.category)}
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-brown-900">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 md:gap-14">
          <ProductGallery images={product.images} badge={product.available ? product.badge : undefined} />

          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-3">
              <p className="eyebrow">{categoryName(product.category)}</p>
              <h1 className="t-h1">{product.name}</h1>
              <p className="prose-fp text-[16px]">{product.description || product.summary}</p>
              {/* La respuesta completa —qué es, cuánto sale, dónde y cómo se
                  pide— en texto visible. Antes sólo existía en el meta
                  description, que no todos los buscadores leen. */}
              <p className="text-sm leading-relaxed text-brown-500">
                {product.name} por encargo en {SITE.city}
                {hasPrice(product) ? `, ${priceLabel(product).toLowerCase()}` : ""}. Se pide con{" "}
                {product.leadTimeHours} hs de anticipación y se coordina por WhatsApp: envío{" "}
                {formatPrice(settings.shippingCost)} en zona o retiro sin costo en{" "}
                {SITE.neighborhoods}.
              </p>
            </header>

            <AddToOrder product={product} />

            <dl className="m-0 grid gap-4 border-t border-line-200 pt-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Icon name="truck" size={20} className="mt-0.5 shrink-0 text-brown-700" />
                <div>
                  <dt className="text-sm font-semibold">Envío y retiro</dt>
                  <dd className="m-0 text-sm text-brown-500">
                    Envío {formatPrice(settings.shippingCost)} en zona. Retiro sin costo en{" "}
                    {SITE.neighborhoods}.
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="heart" size={20} className="mt-0.5 shrink-0 text-brown-700" />
                <div>
                  <dt className="text-sm font-semibold">Elaboración</dt>
                  <dd className="m-0 text-sm text-brown-500">
                    {product.craft ?? "Hecho a mano, sin conservantes ni colorantes."}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <Icon name="map-pin" size={20} className="mt-0.5 shrink-0 text-brown-700" />
                <div>
                  <dt className="text-sm font-semibold">Llego a</dt>
                  <dd className="m-0 text-sm text-brown-500">{zones}. Otras zonas, a coordinar.</dd>
                </div>
              </div>
            </dl>

            {product.instagramUrl ? (
              <a
                href={product.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 text-sm text-berry-700 hover:text-brown-900"
              >
                <Icon name="instagram" size={16} />
                Ver la publicación en Instagram
              </a>
            ) : null}
          </div>
        </div>

        {related.length ? (
          <section className="mt-16 md:mt-24" aria-labelledby="titulo-relacionados">
            <div className="mb-6 flex items-baseline gap-4">
              <h2 id="titulo-relacionados" className="t-h2">
                También de {categoryName(product.category).toLowerCase()}
              </h2>
              <hr className="rule-gold flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
