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
