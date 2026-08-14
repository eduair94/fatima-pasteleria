import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * El único recurso que bloqueaba el render era la hoja de estilos: 10,7 KiB
   * que costaban un viaje de red entero antes de poder pintar nada. Al ir
   * incrustada en el `<head>`, los estilos llegan con el HTML.
   *
   * La contrapartida es que quien vuelve al sitio la vuelve a descargar en vez
   * de tomarla de la caché. A este tamaño el cambio conviene: Tailwind genera
   * sólo las clases usadas, y acá lo que importa es la primera visita, que es
   * como llega la gente desde la búsqueda y desde Instagram.
   */
  experimental: {
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Permite usar fotos alojadas fuera del repo desde el panel de administración.
      { protocol: "https", hostname: "**" },
    ],
  },
  /**
   * Las categorías pasaron de `?categoria=` a rutas propias. Se redirige de
   * forma permanente para no perder ningún enlace ya compartido.
   */
  async redirects() {
    return [
      {
        source: "/catalogo",
        has: [{ type: "query", key: "categoria", value: "(?<categoria>.*)" }],
        destination: "/catalogo/:categoria",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        source: "/fotos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
