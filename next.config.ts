import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
