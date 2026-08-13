import { DEFAULT_SHIPPING_COST, DELIVERY_FROM_HOUR, LEAD_TIME_HOURS, SITE } from "./site";
import type { Catalog, Product, Settings } from "./types";

/**
 * Catálogo inicial. Precios, nombres y zonas salen textualmente de las nueve
 * publicaciones archivadas en catalogo.md. Las descripciones están reescritas
 * (no son la caption) pero no agregan ningún hecho que la cuenta no publique.
 * Los dos productos sin precio publicado quedan en null: se muestran como
 * "Consultar" y no se les inventa un valor.
 *
 * Esto es la semilla. Una vez que el panel de administración guarda cambios,
 * la fuente pasa a ser el almacenamiento (ver lib/store.ts).
 */

const STAMP = "2026-08-12T00:00:00.000Z";

export const SEED_PRODUCTS: Product[] = [
  {
    id: "cheesecake-dulce-de-leche",
    slug: "cheesecake-de-dulce-de-leche",
    name: "Cheesecake de dulce de leche",
    category: "cheesecakes",
    summary: "Base crocante, relleno cremoso y una capa generosa de dulce de leche.",
    description:
      "Base de galletitas bien crocante, relleno cremoso de queso y una capa de dulce de leche que cubre toda la superficie. Se hornea por encargo, sin conservantes ni colorantes. El entero rinde alrededor de diez porciones y sirve para una mesa larga; por porción, si querés probarlo o sos poca gente. Se entrega en La Comercial o en Aguada, y también lo llevo a las zonas de reparto.",
    craft: "Base de galletitas y relleno de queso, horneado por encargo y cubierto con dulce de leche.",
    images: [
      {
        src: "/fotos/08_cheesecake_dulce_leche_01.webp",
        alt: "Cheesecake entero cubierto de dulce de leche en espiral, apoyado sobre una tabla de madera clara",
      },
      {
        src: "/fotos/08_cheesecake_dulce_leche_02.webp",
        alt: "Porción de cheesecake de dulce de leche con la base de galletitas a la vista",
      },
    ],
    variants: [
      { id: "entero", label: "Entero", price: 1100, detail: "Aproximadamente 10 porciones" },
      { id: "porcion", label: "Porción", price: 200, detail: "Cada una" },
    ],
    leadTimeHours: LEAD_TIME_HOURS,
    available: true,
    stock: null,
    featured: true,
    order: 1,
    instagramUrl: "https://www.instagram.com/faticastro001/p/DabzmU8DUGZ/",
    updatedAt: STAMP,
  },
  {
    id: "lemon-pie",
    slug: "lemon-pie",
    name: "Lemon pie",
    category: "tortas",
    summary: "Mousse de limón intenso sobre base de galletitas, con merengue suizo dorado a soplete.",
    description:
      "Base de galletitas y mousse de limón intenso, terminado con merengue suizo dorado a soplete. Hecho a mano, con ingredientes naturales, sin colorantes ni conservantes. Se hornea en cantidad limitada, así que conviene reservarlo con tiempo. Entero para compartir, o por porción. Es de los que más se piden cuando alguien quiere algo cítrico y no tan dulce.",
    craft: "Merengue suizo dorado a soplete sobre mousse de limón, con base de galletitas.",
    images: [
      {
        src: "/fotos/01_lemon_pie_01.webp",
        alt: "Lemon pie entero con una capa alta de merengue suizo dorado a soplete, sobre plato blanco",
      },
      {
        src: "/fotos/01_lemon_pie_02.webp",
        alt: "Lemon pie visto desde arriba, con las ondas del merengue tostado",
      },
    ],
    variants: [
      { id: "entero", label: "Entero", price: 900 },
      { id: "porcion", label: "Porción", price: 140, detail: "Cada una" },
    ],
    leadTimeHours: LEAD_TIME_HOURS,
    available: true,
    stock: null,
    badge: "Cantidad limitada",
    featured: true,
    order: 1,
    instagramUrl: "https://www.instagram.com/faticastro001/p/Db6wiy5mbn6/",
    updatedAt: STAMP,
  },
  {
    id: "carrot-cake",
    slug: "carrot-cake",
    name: "Carrot cake",
    category: "tortas",
    summary: "Zanahoria fresca, especias y frosting de queso crema casero.",
    description:
      "Zanahoria fresca rallada, especias y capas de frosting de queso crema hecho en casa, con nuez picada por encima. Sin conservantes ni colorante. Es la torta que más piden en invierno: se corta bien, aguanta el viaje y funciona tanto para un cumpleaños como para una merienda larga. Se entrega entera, lista para cortar.",
    craft: "Zanahoria fresca rallada y frosting de queso crema hecho en casa, armada en capas.",
    images: [
      {
        src: "/fotos/02_carrot_cake_02.webp",
        alt: "Carrot cake con el frosting de queso crema en espiral, nuez picada y tres capas de bizcocho a la vista",
      },
      {
        src: "/fotos/02_carrot_cake_01.jpg",
        alt: "Corte de carrot cake con tres capas de bizcocho, frosting de queso crema y nuez picada en el borde",
      },
    ],
    variants: [{ id: "entera", label: "Torta entera", price: 1200 }],
    leadTimeHours: LEAD_TIME_HOURS,
    available: true,
    stock: null,
    featured: true,
    order: 2,
    instagramUrl: "https://www.instagram.com/faticastro001/p/DbgbYFsGafZ/",
    updatedAt: STAMP,
  },
  {
    id: "torta-de-frutillas",
    slug: "torta-de-frutillas",
    name: "Torta de frutillas",
    category: "tortas",
    summary: "Bizcochuelo esponjoso, crema batida y frutillas frescas cortadas al momento.",
    description:
      "Bizcochuelo esponjoso en capas, crema batida y frutillas frescas cortadas al momento, terminada con hojas de menta. Se arma el mismo día de la entrega para que la fruta llegue firme y la crema no se baje. Es la más vistosa del catálogo: si el pedido es para una mesa donde la torta se mira antes de comerse, es esta.",
    craft: "Se arma el mismo día de la entrega, con la fruta cortada al momento.",
    images: [
      {
        src: "/fotos/06_torta_frutillas_01.webp",
        alt: "Torta de frutillas de dos pisos con crema batida, frutillas picadas y hojas de menta arriba",
      },
      {
        src: "/fotos/06_torta_frutillas_02.webp",
        alt: "Torta de frutillas vista de costado, con las capas de bizcochuelo y crema a la vista",
      },
    ],
    variants: [{ id: "entera", label: "Torta entera", price: 1200 }],
    leadTimeHours: LEAD_TIME_HOURS,
    available: true,
    stock: null,
    order: 3,
    instagramUrl: "https://www.instagram.com/faticastro001/p/Dab2HCFmXcR/",
    updatedAt: STAMP,
  },
  {
    id: "tiramisu",
    slug: "tiramisu",
    name: "Tiramisú",
    category: "tortas",
    summary: "Con plantillas hechas en casa, una por una.",
    description:
      "Tiramisú con plantillas caseras: se hornean acá mismo, una por una, en lugar de comprarlas hechas. Se prepara a pedido y necesita frío, así que se coordina la entrega para que llegue en punto. El precio depende del tamaño, así que se conversa por WhatsApp antes de confirmarlo.",
    craft: "Las plantillas se hornean acá, una por una: no se compran hechas.",
    images: [
      {
        src: "/fotos/03_tiramisu_01.webp",
        alt: "Mesada con huevos, harina, azúcar, manga y placa marcada para hornear las plantillas del tiramisú",
      },
    ],
    variants: [{ id: "consultar", label: "A coordinar", price: null }],
    leadTimeHours: LEAD_TIME_HOURS,
    available: true,
    stock: null,
    order: 4,
    instagramUrl: "https://www.instagram.com/faticastro001/reel/DbY0tl1xQCw/",
    updatedAt: STAMP,
  },
  {
    id: "scones-de-queso",
    slug: "scones-de-queso",
    name: "Scones de queso",
    category: "galleteria",
    summary: "Recién horneados, altos y con queso arriba. Se venden por media docena.",
    description:
      "Scones de queso altos, tiernos por dentro y con queso gratinado arriba. Se hornean en el día y en cantidad limitada, así que hay que encargarlos con tiempo. Se venden de a seis, que es la cantidad que rinde para un desayuno o una merienda de dos o tres personas.",
    craft: "Se hornean en el día, en tandas chicas, con queso gratinado arriba.",
    images: [
      {
        src: "/fotos/09_scones_queso_01.webp",
        alt: "Scones de queso apilados sobre una tabla redonda de madera, con luz de tarde",
      },
      {
        src: "/fotos/09_scones_queso_02.webp",
        alt: "Scones de queso vistos de cerca, con la superficie dorada y el queso derretido arriba",
      },
    ],
    variants: [{ id: "media-docena", label: "6 unidades", price: 100 }],
    leadTimeHours: LEAD_TIME_HOURS,
    available: true,
    stock: null,
    badge: "Cantidad limitada",
    featured: true,
    order: 1,
    instagramUrl: "https://www.instagram.com/faticastro001/p/DabwLFUjWDq/",
    updatedAt: STAMP,
  },
  {
    id: "alfajores-de-maicena",
    slug: "alfajores-de-maicena",
    name: "Alfajores de maicena",
    category: "galleteria",
    summary: "Tapas suaves que se deshacen en la boca, con dulce de leche y coco rallado.",
    description:
      "Tapas de maicena suaves, de las que se deshacen en la boca, rellenas de dulce de leche bien generoso y pasadas por coco rallado en el borde. Se arman de a uno, a mano. Se piden por unidad, así que se puede llevar media docena para una casa o armar una cantidad más grande para una mesa dulce.",
    craft: "Las tapas se hacen de a una y los alfajores se arman a mano, con coco en el borde.",
    images: [
      {
        src: "/fotos/05_alfajores_maicena_01.webp",
        alt: "Dos alfajores de maicena rellenos de dulce de leche y con coco rallado en el borde, sobre un plato blanco",
      },
      {
        src: "/fotos/05_alfajores_maicena_02.webp",
        alt: "Alfajores de maicena apilados, con el relleno de dulce de leche a la vista",
      },
    ],
    variants: [{ id: "unidad", label: "Por unidad", price: 30 }],
    leadTimeHours: LEAD_TIME_HOURS,
    available: true,
    stock: null,
    order: 2,
    instagramUrl: "https://www.instagram.com/faticastro001/p/DbGmZYtlWGX/",
    updatedAt: STAMP,
  },
  {
    id: "brownies",
    slug: "brownies",
    name: "Brownies de chocolate",
    category: "galleteria",
    summary: "Densos, con cobertura de chocolate y nuez picada arriba.",
    description:
      "Brownie denso de chocolate, con cobertura y nuez picada por encima. Se corta en porciones grandes y se pide por porción, así que se puede armar la cantidad justa para la cantidad de gente. Es el más fácil de transportar del catálogo y el que mejor aguanta fuera de la heladera.",
    craft: "Se hornea denso y se corta en porciones grandes, con nuez picada arriba.",
    images: [
      {
        src: "/fotos/07_brownies_01.webp",
        alt: "Dos porciones de brownie de chocolate con cobertura y nuez picada, sobre papel blanco",
      },
      {
        src: "/fotos/07_brownies_02.webp",
        alt: "Brownies de chocolate vistos de cerca, con la miga húmeda a la vista",
      },
    ],
    variants: [{ id: "porcion", label: "Porción", price: 130, detail: "Cada una" }],
    leadTimeHours: LEAD_TIME_HOURS,
    available: true,
    stock: null,
    order: 3,
    instagramUrl: "https://www.instagram.com/faticastro001/p/Dab061gjbZr/",
    updatedAt: STAMP,
  },
  {
    id: "cookies-chocolate-nuez",
    slug: "cookies-de-chocolate-y-nuez",
    name: "Cookies de chocolate y nuez",
    category: "galleteria",
    summary: "Crujientes por fuera, tiernas por dentro, con una nota de canela.",
    description:
      "Chocolate, nueces y una nota sutil de canela. Crujientes por fuera y tiernas en el interior. Se hornean a pedido, en la cantidad que haga falta, así que el precio depende de cuántas lleves y se conversa por WhatsApp antes de confirmar el pedido.",
    craft: "Chocolate, nueces y una nota de canela; crujientes por fuera y tiernas por dentro.",
    images: [
      {
        src: "/fotos/04_cookies_chocolate_nuez_01.webp",
        alt: "Cookies de chocolate y nuez recién horneadas sobre un plato, con luz de tarde de costado",
      },
      {
        src: "/fotos/04_cookies_chocolate_nuez_02.jpg",
        alt: "Cookies de chocolate y nuez apiladas, con los trozos de nuez y chocolate a la vista",
      },
    ],
    variants: [{ id: "consultar", label: "A coordinar", price: null }],
    leadTimeHours: LEAD_TIME_HOURS,
    available: true,
    stock: null,
    order: 4,
    instagramUrl: "https://www.instagram.com/faticastro001/p/DbL7Zp-mbGG/",
    updatedAt: STAMP,
  },
];

export const SEED_SETTINGS: Settings = {
  shippingCost: DEFAULT_SHIPPING_COST,
  leadTimeHours: LEAD_TIME_HOURS,
  deliveryFromHour: DELIVERY_FROM_HOUR,
  whatsappE164: SITE.whatsapp.e164,
  whatsappDisplay: SITE.whatsapp.display,
  announcement: "",
  updatedAt: STAMP,
};

export function seedCatalog(): Catalog {
  return {
    products: SEED_PRODUCTS.map((p) => ({ ...p, images: p.images.map((i) => ({ ...i })) })),
    settings: { ...SEED_SETTINGS },
  };
}
