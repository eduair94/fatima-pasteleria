export type Variant = {
  id: string;
  /** "Entero", "Porción", "6 unidades", "Por unidad". */
  label: string;
  /** null = sin precio publicado; se muestra como "Consultar". */
  price: number | null;
  /** Detalle corto bajo la etiqueta: "10 porciones", "c/u". */
  detail?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  /** Una línea para tarjeta y meta description. */
  summary: string;
  /** Dos o tres frases para la ficha. Redacción propia, no la caption. */
  description: string;
  images: { src: string; alt: string }[];
  variants: Variant[];
  /** Horas de anticipación. 48 en todo el catálogo. */
  leadTimeHours: number;
  /** Pausado = visible en el catálogo pero no se puede agregar al pedido. */
  available: boolean;
  /**
   * Unidades que quedan de la tanda. `null` = sin límite, que es lo normal en
   * lo que se hace por encargo. En 0 el producto se muestra como agotado.
   */
  stock: number | null;
  /** Etiqueta opcional sobre la foto: "Cantidad limitada". */
  badge?: string;
  /** Se destaca en la home. */
  featured?: boolean;
  /** Orden de aparición dentro de su categoría. */
  order: number;
  /** Publicación de origen en Instagram. */
  instagramUrl?: string;
  updatedAt: string;
};

export type Settings = {
  shippingCost: number;
  leadTimeHours: number;
  deliveryFromHour: number;
  whatsappE164: string;
  whatsappDisplay: string;
  /** Aviso opcional en el header: vacaciones, tanda especial, etc. */
  announcement: string;
  updatedAt: string;
};

export type Catalog = {
  products: Product[];
  settings: Settings;
};

/** Ítem del carrito, tal como vive en localStorage. */
export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  variantId: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  note?: string;
  image?: string;
  leadTimeHours: number;
  /** Copia del stock al momento de agregar, para topear el contador. */
  stock?: number | null;
};

export type DeliveryMode = "retiro" | "envio";

export type OrderDetails = {
  name: string;
  phone: string;
  date: string;
  mode: DeliveryMode;
  zoneId?: string;
  address?: string;
  apartment?: string;
  reference?: string;
  comments?: string;
};
