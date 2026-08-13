# Fátima — Pastelería Artesanal · Sistema de diseño

Sistema de diseño para el sitio web público de **Fátima – Pastelería Artesanal**,
emprendimiento de pastelería casera en Montevideo, Uruguay (@faticastro001).
Vende cheesecakes, scones y tortas caseras por encargo, con retiro y envío
dentro de Montevideo. Hoy los pedidos entran por DM de Instagram.

**El producto que este sistema viste** es un sitio público, mobile-first, en
español rioplatense: catálogo alimentado con el contenido de Instagram, carrito
persistente y cierre por WhatsApp. Sin login, sin cuentas, sin pasarela de pago.
El cierre siempre es un link `wa.me` con el pedido ya formateado.

Fuera de alcance del producto (y por lo tanto del sistema): login, checkout con
tarjeta, blog, multi-idioma, app.

## Fuentes que se usaron

| Fuente | Estado |
| --- | --- |
| Brief de marca y de producto entregado en el chat (identidad, paleta, estructura, carrito, SEO) | Define la paleta, la estructura del sitio y las reglas de SEO |
| Carpeta `instagram_faticastro001` — archivo de [@faticastro001](https://instagram.com/faticastro001) al 12/08/2026 | Leída entera. Es la fuente del catálogo, los precios, las zonas, el teléfono y las reseñas |
| `instagram_faticastro001/catalogo.md` — 9 publicaciones con caption y fecha | Origen de los 9 productos y de sus precios |
| `instagram_faticastro001/media` — 17 fotos del feed | Copiadas a `assets/fotos/` |
| `instagram_faticastro001/perfil/foto_perfil_1080.jpg` — el sello circular | Copiado a `assets/brand/`. Es el único activo de marca que existe |
| Historias destacadas "Pedidos!" y "Envíos" | Origen del flujo de pedido, las 48 hs, las zonas, el envío de $ 100 y el horario de entrega |
| Historia destacada "Reseñas ♥️" | Origen de las tres reseñas, textuales |
| Código, Figma o decks | No se entregaron. Los componentes son un set estándar dimensionado a este producto, no la recreación de una librería previa |

Dos elementos del archivo no se pudieron leer: el reel de tiramisú y el primer
video de Reseñas quedaron como fragmentos protegidos. Sus portadas y textos sí
están archivados.

### Datos duros de la cuenta

| Dato | Valor |
| --- | --- |
| WhatsApp | 096 247 822 (`wa.me/59896247822`) |
| Instagram | @faticastro001 |
| Base | Aguada y La Comercial, Montevideo |
| Anticipación | 48 hs, igual para todo el catálogo |
| Entregas | A partir de las 19 h, coordinadas por WhatsApp |
| Envío | $ 100 a La Comercial, Aguada, Tres Cruces, Nuevo Centro, Av. Italia y Parque Batlle |
| Retiro | Sin costo, en Aguada o La Comercial |
| Lema del sello | "El sabor de lo hecho en casa." |

### Catálogo real

| Producto | Precio | Grupo |
| --- | --- | --- |
| Cheesecake de dulce de leche | Entero $ 1.100 · porción $ 200 | Cheesecakes |
| Lemon pie | Entero $ 900 · porción $ 140 | Tortas y tartas |
| Carrot cake | $ 1.200 | Tortas y tartas |
| Torta de frutillas | $ 1.200 | Tortas y tartas |
| Tiramisú | Sin precio publicado | Tortas y tartas |
| Scones de queso | 6 por $ 100 | Scones y galletería |
| Cookies de chocolate y nuez | Sin precio publicado | Scones y galletería |
| Alfajores de maicena | $ 30 cada uno | Scones y galletería |
| Brownies | $ 130 la porción | Scones y galletería |

El brief pedía tres categorías (Cheesecakes, Scones, Tortas caseras) pero la
cuenta vende además cookies, alfajores y brownies. Se agruparon en **Cheesecakes,
Tortas y tartas, Scones y galletería** para que entre todo. Los dos productos sin
precio publicado se muestran como "Consultar" con un botón que abre WhatsApp; no
se les inventó precio.

## Índice

| Archivo / carpeta | Qué es |
| --- | --- |
| `styles.css` | Punto de entrada único. Sólo `@import`. Es el archivo que enlaza el consumidor |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radii.css`, `elevation.css`, `motion.css`, `base.css` |
| `components/components.css` | Clases `fp-*` de los componentes (se importa desde `styles.css`) |
| `components/<grupo>/` | Componentes React: `icon/`, `core/`, `forms/`, `commerce/`, `feedback/`, `brand/` |
| `guidelines/` | 21 fichas de fundamentos que se ven en la pestaña Design System |
| `ui_kits/sitio-publico/` | Recreación del sitio con el catálogo real: home y página de producto |
| `templates/pagina-de-producto/` | Template (Design Component) de la ficha de producto, con tweaks de nombre, precio, unidad y anticipación |
| `assets/icons/` | 31 SVG: Lucide + marcas Instagram y WhatsApp |
| `assets/brand/` | El sello original: `logo-sello.jpg` (1080 px, tal como vino) y `logo-sello.png` (recorte circular, el que usan los componentes) |
| `assets/fotos/` | 17 fotos del feed, con el nombre del producto |
| `thumbnail.html` | Tile del sistema |
| `SKILL.md` | Envoltorio para usar este sistema como Agent Skill |

---

## Fundamentos de contenido

Todo lo que sigue sale de leer las nueve publicaciones y las cuatro historias
destacadas. Donde el brief y la cuenta no coinciden, se marca.

**Quién habla.** Fátima, en primera persona del singular: "te confirmo
disponibilidad", "escribime nomás, estoy para ayudarte", "hechos con cariño, uno
por uno". Al cliente lo trata de vos: "contame tu pedido", "reserva el tuyo".
El plural aparece sólo cuando hay dos partes coordinando ("coordinamos") o
hablando del producto de la casa ("las plantillas de nuestro tiramisú").
Nunca "usted", nunca plural corporativo.

**Tono.** Cálido, breve y sin vueltas. Las frases son cortas y terminan en el
dato práctico: qué es, cuánto sale, dónde y cómo se pide. El argumento de venta
siempre es el mismo y está dicho con las mismas palabras: **artesanal, casero,
ingredientes naturales, sin colorantes ni conservantes, hecho a mano, en cantidad
limitada.**

**Estructura de una publicación.** Tres movimientos, en este orden:

1. Nombre del producto, a veces con un emoji del sabor. *"Lemon pie 🍋"*, *"🥕 Carrot cake - edición invierno"*.
2. De qué está hecho, en una o dos oraciones sensoriales. *"Base de galletitas y mousse de limón intenso, decorado con merengue Suizo dorado a soplete."*
3. Precio, zona y cómo pedir. *"$1200. Aguada/La Comercial. Pedidos por DM o WhatsApp."*

**Estructura de una historia.** Volanta corta en mayúsculas espaciadas
("PASO 1", "ZONA DE ENTREGA", "COSTO"), título de dos o tres palabras en serif
("Escribime", "Contame tu pedido", "Coordinamos", "Así de simple"), y una línea
de apoyo en sans con el dato concreto. Ver la ficha "Plantilla de historias".

**Emoji.** Sí se usan, y con criterio: **uno o dos por publicación**, al final de
una frase o pegado al nombre del producto. El repertorio real es acotado —
🤍 (el más frecuente, cierra el mensaje), 🍋 🥕 🍪 🍫 🤎 💛 👇 — y son siempre del
sabor o del gesto, nunca decorativos en cadena. **En la interfaz del sitio no van
ninguno**: los emoji son voz de Instagram, no de la UI.

**Signos de exclamación.** La cuenta los usa, uno por vez, para arrancar:
*"¡Imposible parar en uno!"*, *"¡Para arrancar el día con algo rico!"*. El brief
pide no encadenarlos, y eso se cumple. En la interfaz del sitio no se usan.

**Diminutivos.** La cuenta los usa como gesto de cercanía: *"base crocantita"*,
*"tapitas suaves"*, *"alfajorcitos"* (este último, en boca de una clienta). El
brief pide evitarlos en el sitio. Se resolvió así: **en el copy de la interfaz no
hay diminutivos; en las citas de reseñas y en los textos que se copien de
Instagram se respetan tal cual.**

**Casing.** Mayúscula inicial y nada más. Las mayúsculas completas existen sólo
como recurso tipográfico: volantas, badges y el arco inferior del sello ("EL
SABOR DE LO HECHO EN CASA.").

**Números y unidades.** Precios en pesos uruguayos con punto de miles y sin
decimales: `$ 1.100`. La cuenta escribe "$1200" pegado; el sitio usa `$ 1.200`
con espacio fino por legibilidad. Anticipación siempre en horas y como la escribe
ella: **"48 hs de anticipación"**. Horarios con "a partir de las 19 h".
Cantidades como vienen: "6 por $100", "$30 cada uno", "por porción".

**Microcopy de referencia.** La columna del medio es textual de la cuenta.

| Situación | Textual de Instagram | En la interfaz |
| --- | --- | --- |
| Invitación a escribir | Escribime nomás, estoy para ayudarte 💛 | Escribime nomás, estoy para ayudarte |
| Cómo pedir | Contame tu pedido: qué querés y para cuándo, con 48hs de anticipación | Contame qué querés y para cuándo, con 48 hs de anticipación |
| Confirmación | Te confirmo disponibilidad y la entrega, a partir de las 19hs | Te confirmo disponibilidad y la entrega, a partir de las 19 h |
| Envíos | ¿Hacés envíos? Sí, así funciona 👇 | Zonas de entrega · Envío $ 100 |
| Cierre de la marca | El sabor de lo hecho en casa. | El sabor de lo hecho en casa. |
| Escasez | En cantidad limitada. Reserva el tuyo por WhatsApp antes del viernes 🤍 | Cantidad limitada |
| Argumento | Hecho artesanalmente, con ingredientes naturales, sin colorantes ni conservantes | Sin conservantes ni colorantes |

**Reglas duras para la interfaz.** Sin emoji. Sin exclamaciones. Sin
diminutivos. Sin mayúsculas de énfasis ni negritas dentro de un párrafo. Voz
activa y frases cortas: si una oración necesita coma tras coma, se parte.

**Producto y SEO.** El texto de cada producto está **reescrito**, no copiado de la
caption: el brief lo exige y el buscador lo premia. La caption sigue siendo la
fuente de los hechos (ingredientes, precio, zona), pero la redacción es propia.
Cada foto lleva `alt` descriptivo de lo que realmente se ve —"Scones de queso
apilados en una tabla redonda de madera, con luz de tarde"—, nunca "foto de
producto". Términos a cubrir: pastelería artesanal Montevideo, cheesecake por
encargo Montevideo, scones caseros, tortas por encargo con envío.

## Fundamentos visuales

**Idea central.** Crema, mucho aire y fotografía grande. La página es un mantel
claro donde lo único saturado es la comida. El dorado aparece en filetes finos,
nunca en bloques.

**Color.** Fondo crema `#FBF6EE` en toda la página; marfil `#FFFDF9` para
tarjetas, un paso más claro que el fondo. (El sello original está sobre
`#FDF5EA`: dos puntos más cálido, imperceptible al lado.) Texto siempre en marrón chocolate
`#3A2A20` con dos atenuaciones (`--brown-700`, `--brown-500`). Dorado apagado
`#C9A227` como acento decorativo: filetes de sección, estrellas de reseña, fondo
de botón con texto marrón encima. **El dorado nunca es color de texto sobre
crema** (2.3:1, no llega a AA). Rosa frutilla `#D97A86` para estados
seleccionados, CTA secundario y el botón de WhatsApp; su versión oscura
`#A34B57` es la única forma admitida de rosa en texto. Como máximo dos fondos por
página: crema y su alterna `--cream-200`; el marrón sólo en la barra de carrito y
el footer.

**Tipografía.** Dos familias. **Prata** (serif de alto contraste, un solo peso)
para títulos, nombres de producto y citas de reseña, con tracking negativo
(-0.02em en display). **Instrument Sans** para cuerpo, precios, formularios,
badges y volantas. Los precios llevan `font-variant-numeric: tabular-nums`. Las
volantas van en mayúsculas con 0.14em de tracking, siempre en sans. Ningún
título en sans, ningún formulario en serif.

**Espaciado y layout.** Escala de 4px. Margen lateral de 20px en mobile, 40px en
desktop. Entre secciones, 56px en mobile y 96px en desktop: el aire es parte de
la identidad. Medida de lectura acotada a 34rem. Fijos: header pegajoso de 56px
con crema al 92% y `backdrop-filter: blur(8px)`, y barra de carrito de 64px
pegada al pie en mobile (con `env(safe-area-inset-bottom)`). La transparencia y el
blur existen sólo en esos dos elementos.

**Fondos e imágenes.** Fotografía full-bleed, sin marcos ni bordes: hero en 4:5
en mobile, tarjetas de catálogo en 4:5, ficha en 4:3 o 1:1. Sin patrones,
texturas, ilustraciones ni gradientes decorativos. El único gradiente del sistema
es el degradado de protección (`--scrim-bottom`) para texto sobre foto: nunca
cápsulas ni cajas opacas sobre la imagen.

**Cómo son las fotos reales.** Las 17 fotos del feed son de la propia Fátima, con
teléfono y luz natural de casa. Plano corto, casi siempre el producto entero o un
corte con las capas a la vista, encima de lo que hay: tabla de madera, plato
blanco, papel de horno, cartón. Los fondos aparecen y no se esconden. La
temperatura es cálida y la luz es lateral, de tarde. **No se aplican filtros,
duotonos, blanco y negro ni grano**, y no se recorta el producto fuera de cuadro:
el sistema sólo recorta al centro para llevarlas a 4:5 o 1:1. Las relaciones de
origen varían (cuadrada, 4:5, 16:9), así que toda foto entra por `PhotoFrame` o
`ProductCard`, que fijan el recorte.

**Marca sobre foto.** El sello es un mapa de bits sobre crema: **no va sobre
fotografía ni sobre marrón**. Ahí se usa `Wordmark inverse`.

**Tarjetas.** Marfil, borde de 1px `#E7DCC9`, radio de 18px y sombra amplísima de
muy baja opacidad teñida en marrón (`0 1px 2px rgba(58,42,32,.04)`,
`0 10px 28px -18px rgba(58,42,32,.16)`). Las tarjetas de producto recortan la foto
al borde superior sin padding. Nada de sombras duras, ni bordes de color a la
izquierda, ni tarjetas con gradiente.

**Radios.** 4px casillas, 8px miniaturas, 12px inputs, 18px tarjetas, 26px
modales y bloques redondeados, pill para botones y chips. Ningún ángulo recto en
elementos interactivos.

**Movimiento.** Todo con salida suave `cubic-bezier(.22,.61,.36,1)` y nada
rebota. 120ms para color, borde y fondo; 180ms para fundidos y el lift de tarjeta
(`translateY(-2px)`); 280ms para el zoom de foto en hover (`scale(1.03)`); 320ms
para la hoja inferior que entra desde abajo 16px. Se respeta
`prefers-reduced-motion`: todas las duraciones caen a 1ms y se anulan lift, press
y zoom.

**Hover.** Botón primario oscurece a `--brown-800`; secundario a `--berry-600`;
ghost gana fondo `--cream-200`; tarjeta sube 2px y pasa a `--shadow-raised`; la
foto de la tarjeta hace zoom del 3%; los enlaces pasan de rosa oscuro a marrón.
Nunca se usa opacidad para el hover.

**Press.** `scale(0.985)` en botones y tarjetas interactivas. Sin cambio de color
adicional.

**Foco.** `--ring-focus`: halo rosa claro de 3px más borde `--berry-600`. Visible
siempre, nunca `outline: none` sin reemplazo.

**Deshabilitado.** Fondo `--cream-300` y texto `--brown-300`, sin sombra, sin
transformación. Se usa de verdad: el botón de enviar el pedido queda apagado
hasta que estén nombre, teléfono, fecha y —si es envío— dirección y zona.

**Objetivos de toque.** 44px mínimo en mobile (`--hit-min`), 52px para el CTA
principal, 64px de alto la barra de carrito. Los botones de 36px existen sólo en
desktop.

---

## Iconografía

- **Set:** [Lucide](https://lucide.dev) (MIT), trazo de 2px del original, dibujado
  a 1.75 en el sistema. Los 29 glifos usados están copiados en `assets/icons/`.
  No hay icon font ni sprite: son SVG sueltos, inyectados por el componente `Icon`.
- **Marcas:** Instagram y WhatsApp vienen de [Simple Icons](https://simpleicons.org)
  (CC0) y son de relleno, no de trazo. Son los dos únicos iconos de marca
  admitidos.
- **Sustitución declarada:** el brief no traía un set de iconos. Lucide es una
  sustitución elegida por afinidad —trazo fino, esquinas redondeadas, mismo aire
  que la tipografía— y está marcada como tal. Si aparece un set propio, se
  reemplazan los SVG de `assets/icons/` y se regenera `components/icon/icons.data.js`.
- **Tamaños:** 16px inline con texto de 14, 20px por defecto y en botones, 24px en
  barras y CTA grandes. Nunca por debajo de 13px (badges).
- **Color:** heredan `currentColor`, o sea marrón. Dorado sólo en las estrellas de
  reseña y en el icono de la barra de carrito sobre marrón. Ningún icono
  multicolor.
- **Emoji: no se usan en la interfaz.** La cuenta sí los usa en las captions
  (🤍 🍋 🥕 🍪 🍫 💛), uno o dos por publicación; eso es voz de Instagram y no cruza
  al sitio. Tampoco se usan caracteres unicode como iconos, con dos excepciones
  tipográficas: el separador `·` en metadatos y el `/` de la miga de pan.
- **Dibujo de línea del sello.** El batidor, el bol, las hojas y los corazones que
  están dentro del sello son parte del logotipo, no una librería de ilustración:
  **no se extraen, no se reutilizan sueltos y no se redibujan.** Si hiciera falta
  un repertorio decorativo propio, hay que pedirle el vector original a quien
  diseñó el sello.
- **Nunca** se dibuja un icono a mano ni se inventa un SVG: si falta un glifo, se
  agrega el archivo de Lucide correspondiente a `assets/icons/`.

---

## Componentes

27 exportaciones, agrupadas por concern. Cada carpeta tiene su ficha `.card.html`
con los estados; cada componente, su `.d.ts` y su `.prompt.md`.

**`components/icon/`** — `Icon`. Único acceso a la iconografía.

**`components/core/`** — `Button`, `IconButton`, `Badge`, `Chip`, `Card`,
`SectionHeading`.

**`components/forms/`** — `Field` (envoltorio de etiqueta, ayuda y error), `Input`,
`Textarea`, `Select`, `Checkbox`, `RadioGroup`, `DateField` (bloquea fechas por
debajo de la anticipación mínima del carrito).

**`components/commerce/`** — `ProductCard`, `QuantityStepper`, `CartLine`,
`CartBar`, `LeadTimeNote`, y `Order`: helper sin UI con `formatPrice`,
`formatDate`, `maxLeadDays`, `buildMessage` y `buildLink` (arma el `wa.me` con el
mensaje del pedido en el orden fijo del brief).

**`components/feedback/`** — `Modal` (hoja inferior en mobile, tarjeta centrada en
desktop), `Accordion`, `Alert`, `ReviewCard`.

**`components/brand/`** — `Logo` (el sello original), `Wordmark` (lockup
tipográfico para donde el sello no entra), `PhotoFrame`.

### Adiciones intencionales

El brief no definía inventario de componentes, así que el set es estándar y
dimensionado a este producto. Tres piezas no son primitivas genéricas sino
respuestas directas al brief, y quedan declaradas:

- `Icon` — envoltorio necesario para no dibujar SVG a mano.
- `Order` — la lógica del mensaje de WhatsApp es el cierre del producto; vive en
  el sistema para que ningún consumidor la reescriba distinta.
- `LeadTimeNote` y `DateField` — la anticipación mínima es una regla de negocio
  que aparece en cuatro vistas; se resolvió como componente en lugar de copiar
  texto.

---

## UI kit

`ui_kits/sitio-publico/` — sitio público de pedidos, ancho de diseño 390px.

- `index.html` — home completa e interactiva, con el catálogo real: hero con el
  corte de carrot cake, tres categorías con filtro, ficha en hoja inferior,
  carrito con notas por ítem, formulario de cierre con la fecha bloqueada a 48 hs,
  y el mensaje de WhatsApp que se envía al 096 247 822. También los tres pasos de
  pedido, las reseñas textuales, las zonas de envío, la FAQ y el footer.
- `producto.html` — página de producto con URL propia (`/lemon-pie`): la versión
  indexable de la ficha, con `<title>`, description, Open Graph y JSON-LD
  `Product` con dos `Offer` (entero y porción).

Detalle de archivos y del recorrido en `ui_kits/sitio-publico/README.md`.

## Templates

`templates/pagina-de-producto/PaginaDeProducto.dc.html` — punto de partida para
un proyecto que consuma el sistema: la ficha de producto completa, con controles
para cambiar nombre, categoría, precio, unidad, porciones y anticipación. Carga
el sistema con `ds-base.js`; en un proyecto consumidor hay que apuntar la línea
`base` de ese archivo al árbol `_ds/<carpeta>` correspondiente.

Además quedan marcados como starting point `Button`, `SectionHeading`, `Input`,
`RadioGroup`, `ProductCard`, `CartBar`, `Modal`, `ReviewCard`, `Accordion`,
`Wordmark`, `PhotoFrame` y las dos pantallas del kit.

---

## Reglas de implementación que el sistema asume

Vienen del brief y condicionan el diseño, así que se documentan acá:

- Catálogo renderizado en servidor o estático. El contenido del catálogo nunca
  existe sólo en cliente.
- Una URL indexable por producto, con slug en español, además del modal.
- JSON-LD `Bakery`/`LocalBusiness` en la home; `Product` + `Offer` en cada
  producto. Metadatos y Open Graph por producto, con la foto del producto como
  imagen social.
- Imágenes WebP responsive y objetivo de LCP por debajo de 2 s. `PhotoFrame` y
  `ProductCard` cargan `eager` por defecto —el hero es el LCP— y aceptan
  `loading="lazy"` por instancia: en el catálogo se aplica de la tercera tarjeta de
  cada categoría en adelante.
- `sitemap.xml` y `robots.txt`.
- El checkout no manda nada al servidor: arma el link `wa.me` y abre WhatsApp.

## Decisiones abiertas y faltantes

1. **El acento del sello no es el del brief.** Muestreado del archivo original, el
   sello usa un **cobre `#B5743A`** para los filetes, el batidor, las hojas y el
   arco inferior, y un **rosa terracota `#C98C6F`** para los corazones. El brief
   especifica dorado mostaza `#C9A227` y rosa frutilla `#D97A86`. El crema y el
   marrón sí coinciden. **Se implementó la paleta del brief** (es una instrucción
   explícita) y los valores del sello quedan como tokens `--logo-*`, documentados
   en la ficha "Sello vs paleta". Hay que decidir cuál manda: si gana el sello, se
   cambian dos tokens y el sistema entero se realinea.
2. **El sello es un JPG de 1080 px**, no un vector. Alcanza para pantalla (se usa
   el recorte circular `logo-sello.png`). Para impresión, para versiones en un
   solo color o para ponerlo sobre foto hace falta el archivo original.
3. **Tipografías del sistema elegidas por afinidad.** El sello usa un serif
   didone y una script que no se identificaron ni se entregaron. Para la interfaz
   se eligieron **Prata** (serif de alto contraste, cercano al del sello) e
   **Instrument Sans**, ambas de Google Fonts, cargadas por `@import` en
   `tokens/fonts.css`. Si aparecen las familias reales, se reemplaza ese archivo.
   La script del sello no se replica en ningún lado de la interfaz.
4. **Dos productos sin precio publicado**: tiramisú y cookies de chocolate y nuez.
   Se muestran como "Consultar" con un botón que abre WhatsApp. No se les inventó
   precio.
5. **Faltan formas de pago, seña y conservación.** El brief pide esas tres
   preguntas en la FAQ y la cuenta no publica ninguna. Quedaron en el sitio con la
   respuesta "A confirmar con Fátima" para que se vea el hueco.
6. **Agrupación del catálogo a confirmar.** Ver "Catálogo real": se usaron tres
   grupos que cubren los nueve productos, en lugar de los tres del brief.
7. **Iconos:** Lucide + Simple Icons, sustitución declarada (ver Iconografía).
8. **Reseñas:** son tres fragmentos textuales de mensajes de clientas, tomados de
   la historia destacada. No están firmadas con nombre porque en el origen tampoco
   lo están. Conviene pedir permiso y nombre antes de publicarlas.
