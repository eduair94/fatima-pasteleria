# SEO — qué está hecho y qué falta

Resultado de la auditoría del 13 de agosto de 2026 (técnico, contenido, datos estructurados,
SEO local y buscadores con IA). Lo que era código ya está implementado; lo que queda es trabajo
fuera del sitio, que es donde está el mayor retorno.

## Puntajes de partida

| Área | Puntaje | Lectura |
| --- | --- | --- |
| Buscadores con IA (GEO) | 68/100 | El punto fuerte: renderizado en servidor, API pública, FAQ que coincide con el texto visible |
| Contenido / E-E-A-T | 42/100 | Fichas con poco texto propio y sin firma de autoría |
| SEO local | 39/100 | La base técnica está bien; la presencia externa estaba en cero |

Los tres informes coincidieron en el mismo hallazgo crítico: el sitio se canonicalizaba contra
otro dominio. Ya está corregido de raíz.

---

## Hecho en el sitio

**Dominio y canonical.** La URL canónica sale del entorno (`NEXT_PUBLIC_SITE_URL`, y si falta,
`VERCEL_PROJECT_PRODUCTION_URL`). Antes había un dominio escrito a mano como valor por defecto,
así que un despliegue nuevo heredaba el dominio de otro proyecto y le regalaba todas las señales.

**`robots.txt`.** `/pedido` ya no va con `Disallow`: tiene `noindex` en sus metadatos y un
`Disallow` impedía que el buscador entrara a leerlo, con lo cual la URL podía terminar indexada
igual, sin descripción. Se usa un solo mecanismo por ruta. También se quitó la directiva `Host:`,
propietaria de Yandex y deprecada desde 2018.

**Catálogo en rutas estáticas.** Las categorías pasaron de `?categoria=` a `/catalogo/<grupo>`.
Leer `searchParams` volvía dinámica la página de mayor intención de compra: se renderizaba entera
en cada visita, sin caché de CDN. Ahora `/catalogo` y las tres categorías se sirven
prerenderizadas (`X-Vercel-Cache: HIT`). Las URLs viejas redirigen con 308.

**`og:url` por ruta.** En el catálogo y las categorías heredaba el de la portada, así que
compartir un enlace de categoría mostraba la vista previa de la home.

**Contenido de las fichas.** Las descripciones pasaron de ~30 a 44-68 palabras y cada producto
tiene su propia línea de elaboración. Antes las nueve fichas repetían el mismo bloque y de ~160
palabras visibles sólo el 15% era propio del producto.

**La respuesta, en texto visible.** Qué es, cuánto sale, dónde y cómo se pide vivía sólo en el
`meta description` y en el JSON-LD. Ahora también es un párrafo visible, en las fichas y en el
catálogo, para no depender de que el buscador lea metadatos.

**Sección «Cómo trabajo».** Quién está detrás del producto era lo más flojo del sitio.

**Retiro sin costo por barrio.** Aguada y La Comercial tienen texto y ancla propios: es la
ventaja concreta frente a las pastelerías con local.

**Datos estructurados.** `Offer.seller` era un `@id` colgado —el nodo `Bakery` se define en la
portada y los parsers procesan cada URL por separado, así que desde una ficha llegaba vacío—; se
agregó `shippingDetails` con el costo y el plazo publicados; y los tres testimonios reales se
marcan como `Review` **sin `reviewRating`**.

**`llms.txt` generado del catálogo.** Era un archivo estático con los precios copiados a mano: al
cambiar un precio en el panel quedaban dos fuentes oficiales diciendo cosas distintas.

**Menos fricción en el pedido.** El teléfono dejó de ser obligatorio —el pedido llega por
WhatsApp, así que el número ya viene con el chat— y en mobile hay una barra fija con el total y
el botón de enviar, que lleva el foco al primer campo que falte.

**Prioridad de red de la imagen LCP.** La foto del hero salía a prioridad `Low` en mobile y
quedaba encolada detrás de otros recursos. El `priority` de `next/image` genera el
`<link rel="preload">` pero no marca `fetchpriority`, así que el navegador no tenía cómo saber
que esa imagen era el LCP. Ahora va explícito, y queda tanto en el `<img>` como en el preload.
Mismo cambio en la primera foto de las fichas.

---

## Lighthouse: dónde está cada página

Medido contra producción con Lighthouse 13.

| Página | Escritorio | Móvil (rendimiento) |
| --- | --- | --- |
| Portada | **100 / 100 / 100 / 100** | 93-98 |
| Catálogo y las tres categorías | **100 / 100 / 100 / 100** | 95-98 |
| Fichas de producto | **100 / 100 / 100 / 100** | 94-98 |
| `/pedido` y `/pedido/enviado` | 100 / 100 / 100 · SEO 66 | 99 |

En escritorio está todo en 100. En móvil, **accesibilidad, buenas prácticas y SEO están en 100 en
todas las páginas públicas**; lo que se mueve es rendimiento.

### Lo que se arregló

**Accesibilidad, de 82 a 100 en las fichas.** Cuatro problemas de marcado reales: la tira de
miniaturas tenía `role="tablist"` sobre un `<ul>`, lo que rompía tres auditorías a la vez (los
`<li>` no son hijos válidos de un tablist y a la vez perdían su lista); el `<dl>` tenía los
`<dt>`/`<dd>` dos niveles abajo; los chips de categoría usaban `aria-pressed`, que no existe en
enlaces; y el logo tenía una etiqueta que no contenía su propio texto visible. La galería quedó
además con navegación por flechas, Home y End.

**CLS de `/pedido`, de 0,191 a 0.** El carrito vive en localStorage, así que el HTML
prerenderizado no puede saber si hay ítems y siempre sale con el formulario. Al hidratar con el
carrito vacío el formulario se reemplazaba por el cartel de «pedido vacío», la página se encogía
1018 px y el pie subía a la vista. Se resolvió con un alto mínimo de un viewport: el pie arranca
debajo del pliegue y sigue debajo, así que no salta ni con el carrito vacío ni con ítems.

**Prioridad de red de la imagen LCP.** Salía en `Low` en móvil porque `priority` de `next/image`
genera el preload pero no marca `fetchpriority`. Ahora va explícito.

### Lo que se probó y se descartó, con la medición

- **Incrustar el CSS en el `<head>`** (`experimental.inlineCss`). Es la recomendación genérica
  para «eliminar el CSS que bloquea el render», y **empeora**: la portada bajó de 97 a 90, el HTML
  pasó de 22 a 34 KiB y el bloqueo del hilo principal de 130 a 310 ms. La hoja es del mismo origen
  y viaja por una conexión HTTP/2 ya abierta, así que ese «viaje extra» no paga ni DNS ni TLS.
  Se revirtió.
- **`browserslist` para sacar los polyfills.** No hay nada que sacar: Next 16 ya compila para
  `chrome 111 / safari 16.4`, y el bundle de core-js de 110 KiB se sirve con `nomodule`, así que
  ningún navegador lo descarga (verificado por md5 y por tres listas de requests). Poner
  `browserslist` sólo puede hacer que Next transpile **más**.
- **El «JS sin usar» (26 KiB).** Está entero dentro de react-dom. No sale con ningún cambio a
  nivel de aplicación.
- Los avisos de `render-blocking`, `network-dependency-tree` y `forced-reflow` son falsos
  positivos: Lighthouse les asigna 0 ms de ahorro, la «cadena crítica» son dos niveles —documento
  y CSS, el mínimo posible— y el reflow aparece como `[unattributed]`, sin ningún layout anidado
  dentro de JS en seis rutas.

### Por qué el 100 de rendimiento en móvil no se persigue más

Lo único que separa de 100 es el LCP, y su desglose es TTFB 238 ms + espera para iniciar la
descarga 229 ms + descarga 91 ms + pintado 173 ms. La foto ya pesa 33 KiB en AVIF y sale con
prioridad alta: bajarle bytes rinde milisegundos. Llegar a 100 exigiría un LCP por debajo de
~1,2 s bajo la simulación de Lighthouse (1,6 Mbps y 150 ms de latencia), que para una página cuyo
elemento principal es una fotografía significa sacar la foto. En un sitio de pastelería la foto
**es** el producto: sería cambiar una venta por un número.

**Sobre la confiabilidad del número.** La misma página sin ningún cambio dio 98 y 94 en dos
corridas seguidas, con Speed Index de 1,3 s y 4,0 s. La máquina de medición tiene decenas de
procesos de Chrome compitiendo por CPU y Lighthouse escala los tiempos según el equipo. Cualquier
diferencia menor a ~5 puntos en esta tabla es ruido, no una mejora ni una regresión. **El número
que va a valer es el de campo (CrUX), cuando el sitio tenga tráfico real**: la API sin key
devuelve `429` y CrUX pide key registrada, así que hoy no hay percentil 75 que consultar.

### El 66 de SEO en `/pedido` es a propósito

Esas dos páginas llevan `noindex` y Lighthouse lo penaliza en la categoría de SEO. Es correcto que
lo lleven: son el formulario de datos y la confirmación, no tienen contenido por el que nadie
busque, e indexarlas sólo sumaría páginas delgadas. Sacar el `noindex` pondría el 100 y no traería
una sola visita. Se deja como está.

---

## Falta, y es lo que más rinde

Ordenado por retorno. Nada de esto es código.

### 1. Google Business Profile — la palanca más grande

Vale cerca del 60% del peso del SEO local y hoy está en cero. Es un **service-area business**: se
crea con la dirección oculta.

- Antes de crear nada, buscá «Fátima Pastelería» en Google Maps: si ya existe una ficha generada
  automáticamente, hay que reclamarla en lugar de crear otra.
- Al crearla, activá «Entrego bienes y servicios a mis clientes» y **desmarcá mostrar la
  dirección**. Google la usa para calcular cercanía, pero no la publica.
- Área de servicio **por barrio**, no por radio: Aguada, La Comercial, Tres Cruces, Nuevo Centro,
  Av. Italia y Parque Batlle — los mismos que ya declara el schema.
- **Categoría primaria: «Cake shop» o «Custom cake maker»**, no «Bakery» a secas, que en Uruguay
  se asocia a panadería de pan y facturas. Es el factor de ranking local más importante.
- **El nombre va sin palabras clave.** «Fátima Pastelería», nada más. Meter «por encargo
  Montevideo» en el nombre es la causa más común de suspensión de fichas.
- Subí las fotos del catálogo el primer día. Las fichas con fotos propias rankean mejor que las
  que dependen de fotos de clientes.

**Descripción para pegar** (Google admite 750 caracteres; ésta usa 690 y sólo dice cosas que la
cuenta ya publicó):

> Pastelería artesanal por encargo en Montevideo. Hago cheesecakes, tortas y tartas, scones,
> alfajores de maicena y brownies, todo en tandas chicas y horneado para cada pedido.
>
> Uso ingredientes naturales, sin conservantes ni colorantes. Las plantillas del tiramisú las
> horneo acá, una por una, en lugar de comprarlas hechas.
>
> Los pedidos se toman con 48 horas de anticipación y se coordinan por WhatsApp: me contás qué
> querés y para cuándo, y te confirmo disponibilidad y la entrega, a partir de las 19 h.
>
> Retiro sin costo en Aguada y La Comercial. Envío a Tres Cruces, Nuevo Centro, Av. Italia y
> Parque Batlle. Otras zonas de Montevideo, a coordinar.

Notas de uso: no le agregues palabras clave al final ni repitas «Montevideo» de más — Google
premia que se lea natural. Cuando haya dominio propio, cambiá el sitio web de la ficha.

**Las estrellas salen de ahí, no del sitio.** Por eso el schema no declara ninguna calificación:
inventarla sería falsear datos, y las estrellas que Google muestra para un negocio local vienen
de su ficha.

### 2. Pedir reseñas después de cada entrega

Una vez que exista la ficha, la constancia importa más que el volumen: si pasan unas tres semanas
sin reseñas nuevas, el ranking local cae. Un mensaje después de cada entrega alcanza.

### 3. Instagram

- Poner el link del sitio en la bio: hoy no está, y es la principal fuente de tráfico.
- Corregir «Pasteleria» → «Pastelería» en el nombre del perfil.
- Configurarlo como cuenta de negocio con categoría de rubro.

### 4. Facebook Page y Bing Places

Gratis, diez minutos cada uno. Bing Places se importa casi automáticamente desde Google Business
Profile. Alimentan Bing Copilot y Apple Maps.

### 5. Contar la historia

La sección «Cómo trabajo» está escrita sólo con hechos ya publicados: cómo trabaja, con qué, y
desde dónde entrega. Lo que **no** está —y es lo que más levantaría la autoridad del sitio— es
lo que sólo Fátima sabe: hace cuánto arrancó, por qué, qué aprendió y de quién. Cien palabras
escritas por ella valen más que cualquier cosa que se pueda deducir del catálogo.

---

## Decisiones deliberadas, para no volver a discutirlas

- **Sin `aggregateRating`.** No existe ninguna calificación publicada. Los tres testimonios se
  marcan como `Review` sin puntaje, que es válido en schema.org.
- **Sin páginas por barrio.** Con nueve productos y seis zonas, seis páginas serían contenido
  casi duplicado. Los bloques de Aguada y La Comercial cubren lo que importa: donde el retiro es
  gratis.
- **Sin `HowTo`.** Google discontinuó ese resultado enriquecido en 2023.
- **Sin blog.** Es un emprendimiento de una persona; el costo de mantenerlo no se justifica.
- **Dos productos sin precio.** Tiramisú y cookies se muestran como «Consultar» porque la cuenta
  nunca publicó uno. No se les inventa un valor.

## Pendiente de decidir

- **Content-Security-Policy.** El sitio tiene el resto de las cabeceras de seguridad, pero no CSP.
  Agregarla en Next requiere nonces por script y hacerlo mal rompe la página, así que conviene
  hacerlo aparte y en modo `report-only` primero.
- **Dominio propio.** Un `.vercel.app` sirve para arrancar, pero un dominio propio
  (`fatimapasteleria.uy` o similar) es lo que conviene antes de imprimir cualquier cosa o cargar
  la ficha de Google.
