/**
 * Datos duros del negocio. Todo lo de acá sale del archivo de Instagram
 * (@faticastro001, catalogo.md) y de las historias destacadas "Pedidos!" y
 * "Envíos". No se inventa ningún dato comercial.
 */

/**
 * URL canónica del sitio, en orden de prioridad:
 *
 *   1. `NEXT_PUBLIC_SITE_URL`, si está definida. Es la que manda, y la que hay
 *      que usar cuando el sitio tenga dominio propio.
 *   2. `VERCEL_PROJECT_PRODUCTION_URL`, que Vercel inyecta sola con el dominio
 *      de producción del proyecto.
 *   3. localhost, para desarrollo.
 *
 * **Acá no va un dominio escrito a mano.** Tenerlo hacía que un despliegue
 * nuevo heredara el dominio de otro proyecto: el canonical, el `og:url` y el
 * sitemap entero apuntaban al sitio equivocado, y con los dos vivos y el mismo
 * contenido, los buscadores le daban todo el valor al viejo. Sólo se nota
 * mirando el HTML, así que conviene que el código no pueda equivocarse.
 */
function resolveSiteUrl(): string {
  const explicita = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicita) return explicita.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const SITE = {
  name: "Fátima — Pastelería Artesanal",
  shortName: "Fátima Pastelería",
  tagline: "Cheesecakes, scones y tortas caseras",
  motto: "El sabor de lo hecho en casa.",
  city: "Montevideo",
  country: "Uruguay",
  countryCode: "UY",
  neighborhoods: "Aguada y La Comercial",
  locale: "es-UY",
  url: resolveSiteUrl(),
  instagram: {
    handle: "@faticastro001",
    url: "https://www.instagram.com/faticastro001/",
  },
  whatsapp: {
    /** Formato humano, como lo publica ella en la historia "Pedidos!". */
    display: "096 247 822",
    /** Formato internacional para wa.me, sin signos. */
    e164: "59896247822",
  },
  author: {
    name: "Eduardo Airaudo",
    url: "https://www.linkedin.com/in/eduardo-airaudo/",
  },
} as const;

/** Anticipación mínima, igual para todo el catálogo. */
export const LEAD_TIME_HOURS = 48;

/** Hora a partir de la cual coordina entregas. */
export const DELIVERY_FROM_HOUR = 19;

export const DEFAULT_SHIPPING_COST = 100;

export type Zone = {
  id: string;
  name: string;
  /** null = a coordinar por WhatsApp. */
  cost: number | null;
};

export const ZONES: Zone[] = [
  { id: "la-comercial", name: "La Comercial", cost: DEFAULT_SHIPPING_COST },
  { id: "aguada", name: "Aguada", cost: DEFAULT_SHIPPING_COST },
  { id: "tres-cruces", name: "Tres Cruces", cost: DEFAULT_SHIPPING_COST },
  { id: "nuevo-centro", name: "Nuevo Centro", cost: DEFAULT_SHIPPING_COST },
  { id: "av-italia", name: "Av. Italia", cost: DEFAULT_SHIPPING_COST },
  { id: "parque-batlle", name: "Parque Batlle", cost: DEFAULT_SHIPPING_COST },
  { id: "otra", name: "Otra zona de Montevideo", cost: null },
];

export const PICKUP_POINTS = ["Aguada", "La Comercial"];

/** Los tres pasos, textuales de la historia destacada "Pedidos!". */
export const ORDER_STEPS = [
  {
    step: "Paso 1",
    title: "Escribime",
    body: "Por WhatsApp al 096 247 822 o por DM en Instagram. El sitio arma el mensaje por vos.",
  },
  {
    step: "Paso 2",
    title: "Contame tu pedido",
    body: "Qué querés y para cuándo, con 48 hs de anticipación.",
  },
  {
    step: "Paso 3",
    title: "Coordinamos",
    body: "Te confirmo disponibilidad y la entrega, a partir de las 19 h.",
  },
] as const;

/**
 * Mensajes reales de clientas, tomados de la historia destacada "Reseñas ♥️".
 * No están firmados porque en el origen tampoco lo están, y no se les asigna
 * puntaje: no existe ninguno publicado. Ver README ("Pendientes con Fátima").
 */
export const TESTIMONIALS = [
  {
    quote:
      "Nada, pasaba a decirte que todo estaba muy rico. A las chicas les re gustaron los alfajorcitos. Volveré a comprar obviamente.",
    source: "Mensaje de una clienta",
    context: "Alfajores de maicena",
  },
  {
    quote: "Muy rica la torta, muchísimas gracias. Quedó preciosa.",
    source: "Mensaje de una clienta",
    context: "Torta por encargo",
  },
  {
    quote: "Muy rica.",
    source: "@majoluzguillama, en Instagram",
    context: "Carrot cake",
  },
] as const;

export type FaqItem = { q: string; a: string };

/**
 * Las tres últimas no tienen respuesta publicada en la cuenta. Se responden
 * derivando al canal donde sí se resuelven, en lugar de inventar una política.
 */
export const FAQ: FaqItem[] = [
  {
    q: "¿Con cuánta anticipación tengo que pedir?",
    a: "48 hs para todo el catálogo. Te confirmo la entrega a partir de las 19 h.",
  },
  {
    q: "¿Hacés envíos?",
    a: "Sí. Envío $ 100 a La Comercial, Aguada, Tres Cruces, Nuevo Centro, Av. Italia y Parque Batlle. Otras zonas de Montevideo, a coordinar. El retiro es sin costo en Aguada o La Comercial.",
  },
  {
    q: "¿Cómo se paga?",
    a: "Lo coordinamos por WhatsApp cuando confirmo el pedido. En el sitio no se paga nada.",
  },
  {
    q: "¿Hay que dejar seña?",
    a: "Te lo confirmo por WhatsApp al momento de tomar el pedido.",
  },
  {
    q: "¿Cómo se conserva?",
    a: "Depende del producto. Te paso las indicaciones por WhatsApp cuando coordinamos la entrega.",
  },
  {
    q: "¿Se puede retirar?",
    a: "Sí, sin costo, en Aguada o La Comercial. Coordinamos el horario por WhatsApp.",
  },
];

/** Categorías del catálogo, en el orden en que se muestran. */
export const CATEGORIES = [
  { id: "cheesecakes", name: "Cheesecakes" },
  { id: "tortas", name: "Tortas y tartas" },
  { id: "galleteria", name: "Scones y galletería" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function categoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}
