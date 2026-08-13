import Image from "next/image";
import Link from "next/link";

import { Accordion } from "@/components/accordion";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { ZonesMap } from "@/components/zones-map";
import { formatPrice } from "@/lib/format";
import { bakeryJsonLd, faqJsonLd } from "@/lib/jsonld";
import { lowestPrice } from "@/lib/product";
import { CATEGORIES, FAQ, ORDER_STEPS, SITE, TESTIMONIALS, ZONES } from "@/lib/site";
import { readCatalog } from "@/lib/store";
import { waConsultLink } from "@/lib/whatsapp";

export const revalidate = 120;

const CATEGORY_PHOTOS: Record<string, { src: string; alt: string }> = {
  cheesecakes: {
    src: "/fotos/08_cheesecake_dulce_leche_02.webp",
    alt: "Porción de cheesecake de dulce de leche con la base de galletitas a la vista",
  },
  tortas: {
    src: "/fotos/01_lemon_pie_02.webp",
    alt: "Lemon pie visto desde arriba, con las ondas del merengue tostado",
  },
  galleteria: {
    src: "/fotos/09_scones_queso_01.webp",
    alt: "Scones de queso apilados sobre una tabla redonda de madera",
  },
};

const INSTAGRAM_STRIP = [
  { src: "/fotos/02_carrot_cake_02.webp", alt: "Carrot cake entero con el frosting trabajado en espiral" },
  { src: "/fotos/06_torta_frutillas_01.webp", alt: "Torta de frutillas con crema y menta" },
  { src: "/fotos/05_alfajores_maicena_01.webp", alt: "Alfajores de maicena con coco rallado" },
  { src: "/fotos/07_brownies_01.webp", alt: "Brownies de chocolate con nuez picada" },
  { src: "/fotos/04_cookies_chocolate_nuez_01.webp", alt: "Cookies de chocolate y nuez recién horneadas" },
  { src: "/fotos/01_lemon_pie_01.webp", alt: "Lemon pie con merengue dorado a soplete" },
];

export default async function HomePage() {
  const { products, settings } = await readCatalog();
  const visible = products.filter((product) => product.available);
  const featured = visible.filter((product) => product.featured).slice(0, 4);
  const shownProducts = featured.length ? featured : visible.slice(0, 4);

  const zonesWithCost = ZONES.filter((zone) => zone.cost !== null);

  return (
    <>
      <JsonLd data={[bakeryJsonLd(products, settings), faqJsonLd()]} />

      {/* ------------------------------------------------------------ hero */}
      <section className="relative">
        <div className="relative aspect-4/5 w-full overflow-hidden bg-cream-300 sm:aspect-16/10 lg:aspect-21/9">
          <Image
            src="/fotos/02_carrot_cake_01.jpg"
            alt="Corte de carrot cake con tres capas de bizcocho, frosting de queso crema y nuez picada en el borde"
            fill
            priority
            sizes="100vw"
            // El corte apaisado tiene que dejar ver las capas y la nuez, que
            // están en la mitad inferior de la foto.
            className="object-cover object-[center_62%]"
          />
          <div className="scrim-bottom absolute inset-0" />
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                "linear-gradient(to right, rgb(58 42 32 / 0.68), rgb(58 42 32 / 0.12) 62%)",
            }}
          />

          <div className="wrap absolute inset-x-0 bottom-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2">
            <div className="flex max-w-[42rem] flex-col gap-4 pb-7 md:gap-5 md:pb-0">
              <h1 className="t-display text-cream-50">Fátima</h1>
              <p className="max-w-[30rem] text-[17px] leading-relaxed text-cream-50 md:text-[19px]">
                Cheesecakes, scones y tortas caseras. Hechas a mano en {SITE.city}, por encargo, sin
                conservantes ni colorantes.
              </p>
              {/* En mobile los botones van debajo de la foto para no taparla. */}
              <div className="mt-1 hidden gap-3 md:flex">
                <Link href="/catalogo" className="fp-btn fp-btn--primary fp-btn--lg">
                  Ver catálogo
                  <Icon name="arrow-right" size={18} />
                </Link>
                <a
                  href={waConsultLink(settings.whatsappE164)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fp-btn fp-btn--secondary fp-btn--lg"
                >
                  <Icon name="whatsapp" size={18} />
                  Escribir por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="wrap flex flex-col gap-3 py-5 md:hidden">
          <Link href="/catalogo" className="fp-btn fp-btn--primary fp-btn--lg fp-btn--block">
            Ver catálogo
            <Icon name="arrow-right" size={18} />
          </Link>
          <a
            href={waConsultLink(settings.whatsappE164)}
            target="_blank"
            rel="noopener noreferrer"
            className="fp-btn fp-btn--secondary fp-btn--lg fp-btn--block"
          >
            <Icon name="whatsapp" size={18} />
            Escribir por WhatsApp
          </a>
        </div>
      </section>

      {/* ---------------------------------------------------- datos duros */}
      <section
        aria-label="Cómo funciona"
        className="border-y border-line-200 bg-cream-200"
      >
        <div className="wrap grid grid-cols-1 gap-6 py-8 sm:grid-cols-3 md:gap-10">
          {[
            {
              icon: "calendar" as const,
              title: "Por encargo",
              body: `${settings.leadTimeHours} hs de anticipación, todo el catálogo`,
            },
            {
              icon: "truck" as const,
              title: "Entrega en zona",
              body: `Envío ${formatPrice(settings.shippingCost)} · retiro sin costo`,
            },
            {
              icon: "heart" as const,
              title: "Elaboración artesanal",
              body: "Sin conservantes ni colorantes",
            },
          ].map((fact) => (
            <div key={fact.title} className="flex items-start gap-3">
              <Icon name={fact.icon} size={24} className="mt-0.5 shrink-0 text-brown-700" />
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold">{fact.title}</p>
                <p className="text-sm text-brown-500">{fact.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- catálogo */}
      <section className="section" aria-labelledby="titulo-catalogo">
        <div className="wrap flex flex-col gap-8">
          <SectionHeading
            eyebrow="Catálogo"
            title="Qué se puede pedir"
            id="titulo-catalogo"
            sub={`Tres grupos. Todo se hace por encargo, con ${settings.leadTimeHours} hs de anticipación.`}
            action={
              <Link href="/catalogo" className="fp-btn fp-btn--ghost">
                Ver todo el catálogo
                <Icon name="arrow-right" size={18} />
              </Link>
            }
          />

          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {CATEGORIES.map((category) => {
              const inCategory = visible.filter((product) => product.category === category.id);
              const prices = inCategory
                .map((product) => lowestPrice(product))
                .filter((price): price is number => price !== null);
              const photo = CATEGORY_PHOTOS[category.id];

              return (
                <Link
                  key={category.id}
                  href={`/catalogo?categoria=${category.id}`}
                  className="fp-prod no-underline"
                >
                  <div className="relative aspect-16/9 overflow-hidden bg-cream-300 md:aspect-4/3">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="fp-prod__img object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-4 md:p-6">
                    <div className="flex flex-col gap-1">
                      <span className="t-h3 md:text-2xl">{category.name}</span>
                      <span className="text-sm text-brown-500">
                        {prices.length
                          ? `Desde ${formatPrice(Math.min(...prices))}`
                          : `${inCategory.length} productos`}
                      </span>
                    </div>
                    <Icon name="arrow-right" size={20} className="shrink-0 text-brown-700" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- destacados */}
      {shownProducts.length ? (
        <section className="pb-14 md:pb-24" aria-labelledby="titulo-destacados">
          <div className="wrap flex flex-col gap-8">
            <SectionHeading
              eyebrow="De esta semana"
              title="Lo que sale del horno"
              id="titulo-destacados"
              sub="Se hornea en cantidad limitada. Reservá con tiempo."
            />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {shownProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------ cómo pedir */}
      <section
        id="como-pedir"
        className="section border-y border-line-200 bg-cream-200"
        aria-labelledby="titulo-como-pedir"
      >
        <div className="wrap flex flex-col gap-8">
          <SectionHeading
            eyebrow="Cómo pedir"
            title="Así de simple"
            id="titulo-como-pedir"
            sub="Escribime nomás, estoy para ayudarte."
          />

          <ol className="m-0 grid list-none gap-6 p-0 md:grid-cols-3 md:gap-10">
            {ORDER_STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-2 border-t border-line-300 pt-5">
                <span className="eyebrow">{step.step}</span>
                <span className="t-h3">{step.title}</span>
                <p className="text-sm leading-relaxed text-brown-700">{step.body}</p>
                {index === 0 ? (
                  <a
                    href={waConsultLink(settings.whatsappE164)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex w-fit items-center gap-2 text-sm text-berry-700 hover:text-brown-900"
                  >
                    <Icon name="whatsapp" size={16} />
                    {settings.whatsappDisplay}
                  </a>
                ) : null}
              </li>
            ))}
          </ol>

          <p className="max-w-[34rem] text-sm leading-relaxed text-brown-700">
            En el sitio no se paga nada. Armás el pedido, se abre WhatsApp con el detalle escrito y
            Fátima confirma disponibilidad, forma de pago y hora de entrega por ese mismo chat.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- reseñas */}
      <section className="section" aria-labelledby="titulo-resenas">
        <div className="wrap flex flex-col gap-8">
          <SectionHeading
            eyebrow="Reseñas"
            title="Lo que dicen las clientas"
            id="titulo-resenas"
            sub="Mensajes tal como llegaron, publicados en la cuenta."
          />
          <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3 md:gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <li key={testimonial.quote} className="fp-card flex flex-col gap-4 p-6">
                <span className="font-serif text-4xl leading-none text-gold-600" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className="t-quote m-0 text-brown-900">{testimonial.quote}</blockquote>
                <footer className="mt-auto flex items-center gap-2 text-sm text-brown-500">
                  <span>{testimonial.source}</span>
                  <span className="h-[3px] w-[3px] rounded-full bg-brown-300" aria-hidden="true" />
                  <span>{testimonial.context}</span>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- zonas */}
      <section
        id="zonas"
        className="section border-y border-line-200 bg-cream-200"
        aria-labelledby="titulo-zonas-seccion"
      >
        <div className="wrap grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Zonas de entrega" title="Dónde llego" id="titulo-zonas-seccion" />
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {zonesWithCost.map((zone) => (
                <li key={zone.id}>
                  <span className="fp-badge fp-badge--neutral">{zone.name}</span>
                </li>
              ))}
            </ul>
            <p className="prose-fp text-[16px]">
              Envío {formatPrice(settings.shippingCost)} a esas zonas, con entrega a partir de las{" "}
              {settings.deliveryFromHour} h. Retiro sin costo en {SITE.neighborhoods}. Otras zonas de{" "}
              {SITE.city}, a coordinar por WhatsApp.
            </p>
            <a
              href={waConsultLink(settings.whatsappE164, "un envío a mi zona")}
              target="_blank"
              rel="noopener noreferrer"
              className="fp-btn fp-btn--secondary w-fit"
            >
              <Icon name="whatsapp" size={18} />
              Consultar mi zona
            </a>
          </div>
          <ZonesMap />
        </div>
      </section>

      {/* ------------------------------------------------------ instagram */}
      <section className="section" aria-labelledby="titulo-instagram">
        <div className="wrap flex flex-col gap-8">
          <SectionHeading
            eyebrow="Instagram"
            title="Todo lo que sale, lo publico acá"
            id="titulo-instagram"
            sub={`Fotos reales de cada tanda, sin filtros. Seguime en ${SITE.instagram.handle}.`}
            action={
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="fp-btn fp-btn--ghost"
              >
                <Icon name="instagram" size={18} />
                Ver el perfil
              </a>
            }
          />
          <ul className="no-scrollbar -mx-5 m-0 flex list-none snap-x gap-3 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-6 md:px-0">
            {INSTAGRAM_STRIP.map((photo) => (
              <li key={photo.src} className="w-[46%] shrink-0 snap-start md:w-auto">
                <a
                  href={SITE.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-square overflow-hidden rounded-xl border border-line-200 bg-cream-300"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 16vw, 46vw"
                    className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------- preguntas */}
      <section
        id="preguntas"
        className="section border-t border-line-200 bg-cream-200"
        aria-labelledby="titulo-preguntas"
      >
        <div className="wrap grid items-start gap-8 md:grid-cols-[380px_1fr] md:gap-14">
          <SectionHeading
            eyebrow="Preguntas"
            title="Antes de pedir"
            id="titulo-preguntas"
            sub="Lo que preguntan siempre por mensaje."
          />
          <Accordion items={FAQ} />
        </div>
      </section>
    </>
  );
}
