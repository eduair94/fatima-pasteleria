# DESIGN.md — Fátima, Pastelería Artesanal

> Sistema visual heredado, no inventado. El mundo ya existía en `design/` (tokens,
> `components.css` y el wireframe completo del sitio). Este archivo documenta la identidad
> tal como quedó implementada y fija las reglas que la mantienen.

## Contrato de dirección

**THESIS.** La página es un mantel claro donde lo único saturado es la comida. Rechaza la
plantilla de e-commerce —grilla apretada, badges de descuento, urgencia fabricada— porque
acá no hay stock infinito ni pago inmediato: hay una persona horneando por encargo.

**OWN-WORLD.** Crema `#FBF6EE` en toda la página, marfil para tarjetas, texto en marrón
chocolate. Dorado apagado en filetes de un píxel, nunca en bloques ni como color de texto.
Rosa frutilla para estados activos y para WhatsApp. Prata de alto contraste en títulos,
Instrument Sans en todo lo demás. Fotografía a sangre, sin marco. Reconocible con el
contenido tapado por el aire entre secciones y por los filetes dorados de 56 px.

**STORY.** La visitante entiende en un viewport qué se vende, que es hecho a mano y que se
pide con 48 hs. Elige, ve el precio real, arma el pedido y lo cierra en WhatsApp sin
escribir dos veces lo mismo.

**FIRST VIEWPORT.** Corte de carrot cake a sangre —capas y nuez a la vista— con degradado
de protección. Encima, "Fátima" en Prata a 40/64 px y una línea que dice qué es y dónde.
En mobile los dos CTA van debajo de la foto para no taparla; en desktop viven sobre ella.

**FORM.** Mundo heredado del sistema de diseño entregado. No hubo torneo de conceptos:
inventar una identidad nueva habría contradicho la instrucción explícita de seguir el
diseño establecido.

## Tokens

Definidos una sola vez en `src/app/globals.css`, dentro de `@theme`, y alias con los
nombres originales del sistema en `:root`. Utilidades de Tailwind y variables CSS son la
misma fuente de verdad.

### Color

| Rol | Token | Valor |
| --- | --- | --- |
| Fondo de página | `--cream-100` | `#FBF6EE` |
| Tarjeta | `--cream-50` | `#FFFDF9` |
| Banda alterna | `--cream-200` | `#F5EDE0` |
| Borde sutil / de énfasis | `--line-200` · `--line-300` | `#E7DCC9` · `#DACBB2` |
| Texto | `--brown-900` · `--brown-700` · `--brown-500` | `#3A2A20` · `#5C4536` · `#7D6553` |
| Acento dorado | `--gold-600` | `#C9A227` |
| Acento rosa | `--berry-500` · `--berry-700` | `#D97A86` · `#A34B57` |

**Reglas duras de color**

- El **dorado nunca es color de texto sobre crema** (2.3:1, no llega a AA). Vive en filetes,
  anillos y bordes de badge. Sobre marrón sí, en `--gold-200`. Esto incluye los glifos
  tipográficos: donde pedía una comilla dorada va un filete.
- El **rosa en texto** sólo en `--berry-700`. `--berry-500` es fondo… **con una corrección**:
  `--berry-500` con tinta crema encima da 2.9:1, así que tampoco sirve como relleno de un
  botón o de un chip seleccionado. El CTA de WhatsApp, el chip activo y el contador del
  carrito usan `--berry-700` (5.6:1) y hover `--berry-800` (7.3:1). `--berry-500` queda para
  superficies sin texto encima: el punto del mapa de zonas, el borde de la tarjeta abierta.
- El **deshabilitado se lee**: `--brown-700` sobre `--cream-300` da 6.9:1. El botón de enviar
  el pedido nace apagado y se queda así hasta que el formulario esté completo, así que es un
  estado de larga vida, no un parpadeo.
- **Como máximo dos fondos por página**: crema y su alterna. El marrón queda para la barra
  de pedido y el pie.
- Sin gradientes decorativos. El único gradiente del sistema es `--scrim-bottom`, para
  proteger texto sobre foto, y tiene que dejar el fondo en contraste AA también sobre las
  zonas claras de la fotografía.

### Tipografía

- **Prata** (400) en títulos, nombres de producto y citas. Tracking `-0.02em` en display,
  `-0.01em` en títulos. Ningún título en sans.
- **Instrument Sans** en cuerpo, precios, formularios, badges y volantas. Ningún formulario
  en serif.
- Clases semánticas: `.t-display` `.t-h1` `.t-h2` `.t-h3` `.t-quote` `.eyebrow` `.prose-fp`.
- Precios y cantidades siempre con `.tnum` (`tabular-nums`).
- Volantas en mayúsculas con `0.14em` de tracking, siempre en sans.
- Medida de lectura acotada a `34rem`.

### Espaciado, radios y sombra

- Escala de 4 px. Margen lateral 20 px en mobile, 40 px en desktop (`.wrap`, máx. 1240 px).
- Entre secciones, 56 px en mobile y 96 px en desktop (`.section`). El aire es identidad.
- Radios: 4 casillas · 8 miniaturas · 12 inputs · 18 tarjetas · 26 modales · pill botones y
  chips. Ningún ángulo recto en elementos interactivos.
- Sombras de difusión amplia y opacidad baja, teñidas en marrón. Nada de sombras duras, ni
  bordes de color a la izquierda, ni tarjetas con gradiente.

### Movimiento

Salida suave `cubic-bezier(.22,.61,.36,1)`. 120 ms color · 180 ms fundido y lift de tarjeta
(`translateY(-2px)`) · 280 ms zoom de foto (`scale(1.03)`) · 320 ms hoja inferior. Nada
rebota. Press `scale(.985)`. **Nunca se usa opacidad para el hover.** Con
`prefers-reduced-motion` todas las duraciones caen a 1 ms y se anulan lift, press y zoom.

### Estados

- **Foco:** halo rosa de 3 px más borde `--berry-600`. Siempre visible, nunca `outline: none`
  sin reemplazo.
- **Deshabilitado:** fondo `--cream-300`, texto `--brown-700`, sin sombra ni transformación.
  Se usa de verdad: el botón de enviar el pedido está apagado hasta tener nombre, fecha y
  —si es envío— zona y dirección. **El teléfono no se pide**: el pedido llega por WhatsApp,
  así que el número ya viene con el chat, y cada campo de más en el único camino de conversión
  se paga.
- **Toque:** 44 px mínimo en mobile, 52 px el CTA principal, 64 px la barra de pedido. Los
  botones de 36 px y los chips de 38 px existen **sólo en desktop**: por debajo de 768 px el
  chip crece a 44 px.
- **Press:** en touch no hay hover, así que `.fp-prod` responde también a `:active` y a
  `:focus-within` con la elevación levantada. Sin eso, tocar una tarjeta no devuelve nada.

## Componentes

Clases `fp-*` en `globals.css`, consumidas por los componentes de React. Cubren botón,
icon button, badge, chip, tarjeta, campos, radio en tarjeta, alerta, acordeón y tarjeta de
producto. Un componente nuevo se arma con estas clases; no se escribe CSS suelto de color.

**Piezas propias de este producto**

- `whatsapp.ts` — el armado del mensaje es el cierre del producto y vive en un solo lugar
  para que ningún consumidor lo reescriba distinto. El orden de los bloques es fijo.
- `ZonesMap` — esquema de posición relativa de las seis zonas, dibujado con el trazo y la
  paleta del sistema. **No es un mapa a escala y lo dice en el pie.**
- `Wordmark` — lockup tipográfico para el header y el pie. El sello original es un mapa de
  bits sobre crema: **no va sobre fotografía ni sobre marrón.**

## Iconografía

[Lucide](https://lucide.dev) (MIT) con trazo de 1.75, más Instagram y WhatsApp de
[Simple Icons](https://simpleicons.org) (CC0), que son de relleno. Todo inline en
`components/icon.tsx`: no hay icon font ni sprite. Heredan `currentColor`. 16 px con texto
de 14, 20 px por defecto, 24 px en barras y CTA grandes.

- Dorado sólo en el icono de la barra de pedido sobre marrón.
- **Nunca se dibuja un icono a mano ni se inventa un SVG:** se agrega el archivo de Lucide.
- **Sin emoji en la interfaz**, y sin unicode como icono, con dos excepciones tipográficas:
  el separador `·` en metadatos y la `/` de la miga de pan.

## Fotografía

Las fotos son de Fátima, con teléfono y luz natural de tarde. Producto entero o corte con
las capas a la vista, sobre lo que hay: tabla de madera, plato blanco, papel de horno.

- **No se aplican filtros, duotonos, blanco y negro ni grano.** Sólo se recorta.
- Relaciones fijas: hero 4:5 en mobile y apaisado en desktop, tarjetas 4:5, ficha 4:3 o 1:1.
- Todo `alt` describe lo que realmente se ve. "Foto de producto" no es un `alt`.
- Las fotos van a sangre, sin marco ni borde.

## Reglas de implementación

- El catálogo se renderiza en el servidor. **El contenido nunca existe sólo en el cliente.**
- Una URL indexable por producto, con slug en español.
- JSON-LD `Bakery` en la portada, `Product` + `Offer` en cada producto, `FAQPage` y
  `BreadcrumbList`. **Sin `aggregateRating`:** no existe ninguna calificación publicada.
- Imágenes responsive en AVIF/WebP. El hero es el LCP y carga con `priority`; el resto del
  catálogo va en `lazy`.
- El checkout no manda nada al servidor: arma el link `wa.me` y abre WhatsApp.
