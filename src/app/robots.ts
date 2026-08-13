import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

/**
 * `/pedido` **no se bloquea acá**, aunque no queremos que se indexe: lleva
 * `noindex` en sus metadatos, y un `Disallow` impediría que el buscador entre
 * a leer justamente esa directiva. Bloqueada y con noindex, la URL puede
 * terminar indexada igual, sin descripción. Se elige un solo mecanismo por
 * ruta: `noindex` donde hay que leer algo, `Disallow` donde no hay que entrar.
 *
 * `/admin` y `/api/admin` sí van con `Disallow`: ahí directamente no queremos
 * tráfico de robots, y el `noindex` de la página queda como red de seguridad
 * para quien llegue por un enlace directo.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
