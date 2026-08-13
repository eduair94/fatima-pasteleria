import { hasPrice, isOrderable, metaDescription } from "./product";
import { FAQ, SITE, TESTIMONIALS, ZONES } from "./site";
import type { Product, Settings } from "./types";

const absolute = (path: string) => (path.startsWith("http") ? path : `${SITE.url}${path}`);

export function bakeryJsonLd(products: Product[], settings: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": `${SITE.url}#pasteleria`,
    name: SITE.name,
    alternateName: SITE.shortName,
    description:
      "Pastelería artesanal por encargo en Montevideo. Cheesecakes, scones, tortas y galletería caseras, sin conservantes ni colorantes.",
    url: SITE.url,
    image: absolute("/og.jpg"),
    logo: absolute("/sello-fatima.png"),
    telephone: `+${settings.whatsappE164}`,
    slogan: SITE.motto,
    priceRange: "$$",
    currenciesAccepted: "UYU",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: "Montevideo",
      addressCountry: SITE.countryCode,
    },
    areaServed: ZONES.filter((zone) => zone.cost !== null).map((zone) => ({
      "@type": "Place",
      name: `${zone.name}, ${SITE.city}`,
    })),
    sameAs: [SITE.instagram.url],
    /**
     * Los tres mensajes reales que se ven en la portada, **sin
     * `reviewRating`**: no existe ninguna calificación publicada y no se
     * inventa una. Es válido en schema.org —el puntaje es opcional— y sirve
     * como señal de confianza citable. Google no va a mostrar estrellas, que
     * es exactamente lo correcto: las estrellas de un negocio local salen de
     * su ficha de Google, no del schema del propio sitio.
     */
    review: TESTIMONIALS.map((testimonial) => ({
      "@type": "Review",
      reviewBody: testimonial.quote,
      author: {
        "@type": "Person",
        name: testimonial.source.startsWith("@")
          ? testimonial.source.split(",")[0]
          : "Clienta de Fátima",
      },
    })),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${settings.whatsappE164}`,
      availableLanguage: ["Spanish"],
      areaServed: SITE.countryCode,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catálogo",
      itemListElement: products.filter(hasPrice).map((product) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: product.name, url: `${SITE.url}/producto/${product.slug}` },
        priceCurrency: "UYU",
        price: Math.min(...product.variants.filter((v) => v.price !== null).map((v) => v.price!)),
        availability: isOrderable(product)
          ? "https://schema.org/PreOrder"
          : "https://schema.org/OutOfStock",
      })),
    },
  };
}

/**
 * El vendedor va con tipo y nombre, no como un `@id` suelto.
 *
 * El nodo `Bakery` se define en la portada, y los parsers procesan cada URL
 * por separado: desde una ficha de producto, una referencia por `@id` a otra
 * página llega como nodo vacío, sin tipo ni nombre.
 */
function sellerNode() {
  return {
    "@id": `${SITE.url}#pasteleria`,
    "@type": "Bakery",
    name: SITE.name,
    url: SITE.url,
  };
}

/** Envío y plazo, con los datos que el sitio ya publica. */
function shippingDetails(settings: Settings) {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: String(settings.shippingCost),
      currency: "UYU",
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: SITE.countryCode,
      addressRegion: "Montevideo",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: Math.ceil(settings.leadTimeHours / 24),
        unitCode: "DAY",
      },
    },
  };
}

export function productJsonLd(product: Product, settings?: Settings) {
  const url = `${SITE.url}/producto/${product.slug}`;
  const availability = isOrderable(product)
    ? "https://schema.org/PreOrder"
    : "https://schema.org/OutOfStock";

  const offers = product.variants
    .filter((variant) => variant.price !== null)
    .map((variant) => ({
      "@type": "Offer",
      name: variant.label,
      price: variant.price,
      priceCurrency: "UYU",
      availability,
      url,
      seller: sellerNode(),
      areaServed: { "@type": "City", name: SITE.city },
      deliveryLeadTime: {
        "@type": "QuantitativeValue",
        minValue: Math.ceil(product.leadTimeHours / 24),
        unitCode: "DAY",
      },
      ...(settings ? { shippingDetails: shippingDetails(settings) } : {}),
    }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: metaDescription(product),
    image: product.images.map((image) => absolute(image.src)),
    url,
    category: product.category,
    brand: { "@type": "Brand", name: SITE.shortName },
    ...(offers.length
      ? {
          offers:
            offers.length === 1
              ? offers[0]
              : {
                  "@type": "AggregateOffer",
                  priceCurrency: "UYU",
                  lowPrice: Math.min(...offers.map((o) => o.price as number)),
                  highPrice: Math.max(...offers.map((o) => o.price as number)),
                  offerCount: offers.length,
                  availability,
                  offers,
                },
        }
      : {}),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function itemListJsonLd(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo de Fátima — Pastelería Artesanal",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE.url}/producto/${product.slug}`,
      name: product.name,
    })),
  };
}
