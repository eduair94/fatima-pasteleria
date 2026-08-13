import { formatPrice } from "@/lib/format";
import { CATEGORIES, FAQ, PICKUP_POINTS, SITE, ZONES } from "@/lib/site";
import { hasPrice, priceLabel } from "@/lib/product";
import { readCatalog } from "@/lib/store";

/**
 * `/llms.txt` para buscadores con IA.
 *
 * Se genera desde el catálogo, no se escribe a mano. Antes era un archivo
 * estático con los precios copiados: en cuanto alguien cambiaba un precio en
 * el panel, quedaban dos fuentes oficiales diciendo cosas distintas — justo lo
 * que un archivo pensado para dar certeza no puede permitirse.
 */

export const revalidate = 3600;

export async function GET() {
  const { products, settings } = await readCatalog();
  const disponibles = products.filter((product) => product.available);

  const zonasConEnvio = ZONES.filter((zone) => zone.cost !== null).map((zone) => zone.name);
  const envio = formatPrice(settings.shippingCost);

  const porCategoria = CATEGORIES.map((category) => {
    const items = disponibles.filter((product) => product.category === category.id);
    if (!items.length) return null;
    return [
      `### ${category.name}`,
      "",
      ...items.map((product) => {
        const precio = hasPrice(product) ? priceLabel(product) : "precio a coordinar";
        return `- [${product.name}](${SITE.url}/producto/${product.slug}) — ${precio}. ${product.summary}`;
      }),
    ].join("\n");
  }).filter(Boolean);

  const texto = `# ${SITE.name}

> ${SITE.tagline} por encargo en ${SITE.city}, ${SITE.country}. Sin conservantes ni colorantes. Los pedidos se toman por WhatsApp con ${settings.leadTimeHours} horas de anticipación; el sitio arma el mensaje y no cobra nada en línea.

## Datos del negocio

- Nombre: ${SITE.name}
- Ciudad: ${SITE.city}, ${SITE.country}
- Base: ${SITE.neighborhoods}
- WhatsApp: ${settings.whatsappDisplay} (+${settings.whatsappE164})
- Instagram: ${SITE.instagram.url}
- Anticipación mínima: ${settings.leadTimeHours} horas, para todo el catálogo
- Entregas: a partir de las ${settings.deliveryFromHour} h, coordinadas por WhatsApp
- Envío: ${envio} a ${zonasConEnvio.join(", ")}
- Retiro: sin costo, en ${PICKUP_POINTS.join(" o ")}
- Otras zonas de ${SITE.city}: a coordinar
- Moneda: peso uruguayo (UYU)
- No hay pago en línea ni pasarela de pagos

## Catálogo

${porCategoria.join("\n\n")}

Los precios salen del catálogo en vivo y pueden cambiar. La fuente autoritativa es la API pública.

## Preguntas frecuentes

${FAQ.map((item) => `**${item.q}**\n${item.a}`).join("\n\n")}

## Cómo se pide

1. Se elige del catálogo y se arma el pedido en el sitio.
2. Se completan nombre y fecha de entrega, y si es envío, la zona y la dirección. El teléfono es opcional.
3. El sitio abre WhatsApp con el pedido ya redactado.
4. Fátima confirma disponibilidad, forma de pago y hora de entrega por ese mismo chat.

## Recursos

- [Inicio](${SITE.url}/): presentación, cómo pedir, zonas de entrega y preguntas frecuentes
- [Catálogo](${SITE.url}/catalogo): todos los productos con precio y opciones
- [API pública de productos](${SITE.url}/api/productos): JSON con productos, precios, opciones y ajustes de entrega
- [Sitemap](${SITE.url}/sitemap.xml)

## Créditos

Sitio desarrollado por ${SITE.author.name} — ${SITE.author.url}
`;

  return new Response(texto, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
