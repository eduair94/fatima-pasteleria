<div align="center">

# Fátima — Pastelería Artesanal

**Sitio de pedidos para una pastelería casera de Montevideo.**
Catálogo con precios reales, carrito persistente y cierre por WhatsApp. Sin cuentas, sin pasarela de pago, sin fricción.

[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-087ea4?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-C9A227)](LICENSE)

[Ver el sitio](https://fatima-pasteleria.vercel.app) · [Instagram @faticastro001](https://www.instagram.com/faticastro001/) · [Pedir por WhatsApp](https://wa.me/59896247822)

</div>

---

## Qué resuelve

Fátima vendía sólo por DM de Instagram: cada pedido eran diez mensajes de ida y vuelta para
averiguar qué hay, cuánto sale, si llega a la zona y para cuándo. Este sitio convierte eso en
**un solo mensaje ya redactado**.

La clienta arma el pedido, elige fecha y modalidad, y el sitio abre WhatsApp con todo escrito:
ítems, notas, subtotal, envío, total, fecha, dirección. Fátima sólo tiene que confirmar.

```
Hola Fátima, quiero hacer un pedido.

Nombre: Carolina Píriz
Teléfono: 099 123 456

Pedido:
· 1 x Cheesecake de dulce de leche (entero) — sin azúcar agregada — $ 1.100
· 6 x Alfajores de maicena — $ 180

Subtotal: $ 1.280
Envío (La Comercial): $ 100
Total: $ 1.380

Fecha de entrega: viernes 15 de agosto
Modalidad: Envío
Dirección: Nueva York 1234, apto 302 (La Comercial)
Comentarios: Timbre 302.

Pedido FP-260813-22
```

Ese mensaje es **lo único que sale del sitio**. No hay servidor de pedidos, no se guardan datos
personales y no se cobra nada en línea.

---

## Funciona así

| | |
| --- | --- |
| 🧁 **Catálogo real** | Nueve productos con los precios publicados en Instagram. Lo que no tiene precio publicado se muestra como «Consultar» y abre WhatsApp: no se inventan valores. |
| 🛒 **Carrito persistente** | Vive en `localStorage`, sobrevive al cierre del navegador y admite una nota por ítem (dedicatoria, sin azúcar, alergias). |
| 📅 **Anticipación real** | 48 hs de mínimo. El calendario bloquea las fechas anteriores y la anticipación del pedido la fija el ítem de mayor plazo. |
| 🚚 **Zonas y envío** | Seis barrios con costo fijo, el resto de Montevideo a coordinar. El total avisa cuando el envío todavía no se puede calcular. |
| 🔐 **Panel propio** | `/admin` con contraseña: cambiar precios, pausar lo que no hay, agregar productos, ajustar envío y anticipación. Sin tocar código. |
| 🔌 **API pública** | `/api/productos` sirve el catálogo en JSON, listo para consumir desde otro canal. |
| 🔄 **Sigue a Instagram** | Un cron diario lee las publicaciones nuevas y propone la ficha con Gemini. Nada se publica sin aprobación, y los precios se verifican contra el texto original. |
| 🔍 **SEO y GEO** | Metadatos por producto, JSON-LD (`Bakery`, `Product`, `Offer`, `FAQPage`, `BreadcrumbList`), sitemap dinámico, `robots.txt` y `llms.txt`. |
| ♿ **Accesible** | Contraste AA, foco visible, objetivos de toque de 44 px, navegación por teclado, `prefers-reduced-motion` respetado. |

---

## Puesta en marcha

```bash
git clone https://github.com/<tu-usuario>/fatima-pasteleria.git
cd fatima-pasteleria
npm install
cp .env.example .env.local   # y completá ADMIN_PASSWORD
npm run dev
```

Si el proyecto ya está en Vercel, en lugar de completar el archivo a mano se bajan las
variables reales:

```bash
vercel link
vercel env pull .env.local
```

El sitio queda en <http://localhost:3000> y el panel en <http://localhost:3000/admin>.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compilación de producción |
| `npm start` | Sirve la compilación |
| `npm run lint` | ESLint con la configuración de Next |
| `npm run typecheck` | TypeScript en modo estricto, sin emitir |

---

## Publicar en Vercel

1. Subí el repositorio a GitHub.
2. En Vercel, **Add New → Project** y elegí el repositorio. Se detecta Next.js solo: no hay que
   configurar comandos.
3. Cargá las variables de entorno (ver abajo) y desplegá.

### Variables de entorno

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `ADMIN_PASSWORD` | **Sí** | Contraseña del panel. **No hay valor por defecto en el código**: sin esta variable el panel no abre para nadie. |
| `ADMIN_SESSION_SECRET` | Recomendada | Firma la cookie de sesión. Si falta, se deriva de la contraseña: funciona, pero cambiar la contraseña cierra las sesiones abiertas. |
| `BLOB_READ_WRITE_TOKEN` | Recomendada | Guarda el catálogo y recibe las fotos que se suben desde el panel. La inyecta Vercel al conectar un Blob store; no se escribe a mano. |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | URL canónica del sitio. Sin ella, los metadatos y el sitemap apuntan al dominio por defecto. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Opcional | Alternativa al Blob **para el catálogo**. Si están, tienen prioridad. También sirven `KV_REST_API_*`. Las fotos siguen necesitando el Blob. |
| `GEMINI_API_KEY`, `APIFY_TOKEN` o `RAPIDAPI_*`, `CRON_SECRET` | Opcional | Sincronización con Instagram. Ver la sección de más abajo. Sin estas variables el resto del sitio funciona igual. |

### Almacenamiento: catálogo y fotos

Un solo **Vercel Blob store** hace las dos cosas: guarda el catálogo y recibe las fotos que se
suben desde el panel. Se conecta una vez desde **Storage → Connect Store → Blob**; Vercel inyecta
`BLOB_READ_WRITE_TOKEN` y el sitio cambia de controlador solo, sin tocar código.

El catálogo usa el primer controlador disponible:

| Controlador | Se activa con | Dónde sirve |
| --- | --- | --- |
| **Redis por REST** | `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (o el par `KV_REST_API_*`) | Producción. Lo más rápido de leer |
| **Vercel Blob** | `BLOB_READ_WRITE_TOKEN` | Producción. Es el modo normal de este proyecto |
| **Archivo** | Nada: es el modo por defecto fuera de Vercel y sin Blob | Desarrollo local. Escribe `data/catalog.json`, ignorado por git |
| **Memoria** | Nada: es el último recurso | Respaldo. El panel lo avisa con una franja amarilla |

Cada guardado en Blob sube un archivo nuevo con marca de tiempo y borra los anteriores salvo los
dos últimos: así la URL cambia en cada cambio y nunca se lee una versión vieja del CDN.

### Fotos

Desde el panel se sube una foto y queda publicada, sin pasar por el repositorio:

1. El navegador **reduce la foto antes de subirla** — máximo 1440 px de lado, WebP con calidad
   0,82. Una foto de teléfono de 6 MB queda en torno a 200 kB. Si el recodificado no achica nada,
   se sube el original: nunca se degrada una foto que ya estaba optimizada.
2. El archivo va **del navegador al Blob directo**. El servidor sólo firma un token de un solo uso
   después de verificar la sesión, así que el tope de 4,5 MB del cuerpo de una función serverless
   nunca entra en juego.
3. La URL pública queda cargada en el producto y `next/image` la sirve en AVIF/WebP.

Los formatos aceptados son JPEG, PNG, WebP y AVIF, hasta 8 MB. Si no hay Blob conectado, el
uploader lo dice y el campo de ruta manual sigue funcionando con las fotos de `public/fotos/`.

---

## Panel de administración

`/admin`, con contraseña. Desde ahí se puede:

- cambiar el precio de cualquier opción y el nombre, el resumen y la descripción;
- **subir fotos desde el teléfono**, que se reducen solas y quedan publicadas al instante;
- cargar el stock de la tanda: vacío es sin límite, un número avisa cuánto queda y topea el
  contador, y en cero el producto pasa a «Se agotó la tanda»;
- pausar un producto («esta semana no hay») sin borrarlo;
- crear y eliminar productos, con sus fotos y textos alternativos;
- destacar productos en la portada y ordenarlos dentro de su grupo;
- ajustar el costo de envío, la anticipación mínima, la hora de entrega y el WhatsApp;
- publicar un aviso en la franja superior del sitio (vacaciones, tanda especial);
- volver al catálogo original publicado en Instagram.

Cada cambio revalida las páginas afectadas, así que se ve en el sitio al instante.

### Seguridad del panel

**La contraseña no está en el código.** Vive sólo en `ADMIN_PASSWORD`, y sin esa variable el panel
no abre para nadie: la pantalla de login muestra las instrucciones de configuración en lugar del
formulario. No hay valor por defecto que alguien pueda leer del repositorio.

- La sesión es una cookie `httpOnly` `SameSite=Lax` firmada con HMAC-SHA256, que vence a las 12 h.
- La comparación de la contraseña es de tiempo constante (`timingSafeEqual`), y no filtra la
  longitud.
- Hay límite de intentos por IP: 8 en 10 minutos.
- `/admin` y `/api/admin/*` van con `noindex` y quedan fuera del `robots.txt`.
- Cambiar `ADMIN_SESSION_SECRET` invalida todas las sesiones abiertas.

Para rotar la contraseña: cambiar la variable en Vercel y volver a desplegar. No hay que tocar
código ni hacer commit.

---

## Sincronizar con Instagram

El catálogo puede seguir a la cuenta sola. Una vez por día el sitio lee las publicaciones
nuevas de [@faticastro001](https://www.instagram.com/faticastro001/), le pide a Gemini que arme
la ficha a partir del texto y las fotos, y deja el resultado esperando en el panel.

```
cron diario
  → traer las últimas publicaciones (Apify o RapidAPI)
  → descartar las que ya están publicadas o ya fueron revisadas
  → Gemini(caption + fotos) → nombre, categoría, precios, descripción y textos alternativos
  → guardar como PROPUESTA
```

> **Nada se publica solo.** La propuesta aparece en la pestaña *Novedades de Instagram* con la
> foto y el caption original al lado, y se publica recién al aprobarla. Un precio mal leído y
> publicado sin mirar es peor que un producto que tarda un día en aparecer.

Tres defensas contra un precio inventado:

1. El prompt prohíbe estimar: si la caption no dice un número, el precio va en `null`.
2. Al recibir la respuesta, **el código vuelve a buscar cada precio en el texto de la caption**
   (probando `1200`, `1.200` y `1 200`). Si no aparece, lo borra y lo anota como advertencia.
3. La propuesta se muestra junto al caption original, así que aprobar sin ver de dónde salió el
   número requiere ignorar algo que está a la izquierda de la pantalla.

Las publicaciones que no venden nada —fotos de proceso, avisos, agradecimientos— se descartan
solas y no vuelven a consumir cuota.

### Proveedores

La cuenta no es nuestra, así que no hay OAuth posible y hay que leerla desde afuera. El
proveedor es un adaptador: se cambia con una variable, sin tocar el resto del código.

| Proveedor | Free tier | Variables |
| --- | --- | --- |
| **Apify** (recomendado) | USD 5 de crédito por mes, sin tarjeta. El actor cobra ~USD 1,50 por 1.000 resultados, así que una corrida diaria de 12 publicaciones gasta centavos | `APIFY_TOKEN` |
| **RapidAPI** | Depende de la API que elijas; varias dan entre 50 llamadas por día y 30 por mes | `RAPIDAPI_KEY`, `RAPIDAPI_HOST`, `RAPIDAPI_PATH` |

El adaptador de RapidAPI es genérico a propósito: en el marketplace hay una docena de scrapers
que cambian de nombre, de ruta y de forma de respuesta seguido, así que el host y la ruta son
variables y la normalización cubre las formas más comunes (`data.items`, `items`, `edges` con
`node`, array plano; captions como string o como `{text}`; fotos en `image_versions2`,
`display_url`, `thumbnail_url` o `carousel_media`). El botón **Probar conexión** del panel trae
tres publicaciones y muestra lo que entendió, sin gastar cuota de Gemini: sirve para ajustar
`RAPIDAPI_PATH` en unos segundos.

Para agregar otro proveedor alcanza con un archivo nuevo en `src/lib/instagram/` que implemente
`InstagramProvider`.

### Puesta en marcha

1. Sacá una clave en [Google AI Studio](https://aistudio.google.com/apikey) → `GEMINI_API_KEY`.
   El free tier son ~1.500 llamadas por día; la cuenta publica menos de diez por mes.
2. Elegí proveedor y cargá sus variables.
3. Definí `CRON_SECRET` con una cadena aleatoria. **Sin ella la corrida diaria no se
   habilita**: una corrida gasta crédito del scraper y cuota de Gemini, así que un endpoint
   abierto es una forma de que un tercero te vacíe la cuenta.
4. Desplegá. El cron de `vercel.json` corre a las 11:00 UTC (8 de la mañana en Montevideo).

En el plan Hobby de Vercel se permiten 2 cron jobs y **una corrida por día cada uno**, que es
justo lo que usa este proyecto. El botón *Buscar novedades* del panel corre lo mismo a demanda.

> ### ⚠️ Lo que hay que saber antes de encenderlo
>
> Leer Instagram con un scraper de terceros **va contra los términos de uso de Meta**, aunque el
> contenido sea público y la cuenta sea de la clienta. En la práctica se usa muchísimo y el
> riesgo recae en el proveedor, pero conviene saberlo antes de encenderlo.
>
> Además, estos servicios **se rompen**: Instagram cambia algo y el scraper deja de andar hasta
> que su dueño lo arregla. Por eso el proveedor es reemplazable y por eso el panel muestra el
> error crudo en lugar de fallar en silencio.
>
> **La salida durable** es conseguir acceso a la cuenta: convertirla a Business o Creator (gratis,
> 30 segundos) y usar la API oficial de Meta, que para tu propia cuenta no pide App Review. El
> día que eso pase, es un adaptador más en `src/lib/instagram/`.

---

## API

### Pública

```http
GET /api/productos                     # catálogo completo + ajustes de entrega
GET /api/productos?categoria=tortas    # filtrado por grupo
GET /api/productos/lemon-pie           # un producto por su dirección web
```

```jsonc
{
  "products": [
    {
      "id": "lemon-pie",
      "slug": "lemon-pie",
      "name": "Lemon pie",
      "category": "tortas",
      "summary": "Mousse de limón intenso sobre base de galletitas…",
      "images": [{ "src": "/fotos/01_lemon_pie_01.webp", "alt": "Lemon pie entero con…" }],
      "variants": [
        { "id": "entero", "label": "Entero", "price": 900 },
        { "id": "porcion", "label": "Porción", "price": 140, "detail": "Cada una" }
      ],
      "leadTimeHours": 48,
      "available": true,
      "stock": null,
      "badge": "Cantidad limitada"
    }
  ],
  "settings": { "shippingCost": 100, "leadTimeHours": 48, "deliveryFromHour": 19 }
}
```

`price: null` significa **sin precio publicado**: la interfaz lo muestra como «Consultar».
`stock: null` significa **sin límite de tanda**, que es lo normal en lo que se hace por encargo;
con un número, la ficha avisa cuánto queda, el contador no deja pasarse y en `0` el producto pasa a
«Se agotó la tanda».

### Administración

Todas piden la cookie de sesión que emite `POST /api/admin/sesion`.

| Método | Ruta | Qué hace |
| --- | --- | --- |
| `POST` | `/api/admin/sesion` | Inicia sesión con `{ "password": "…" }` |
| `GET` | `/api/admin/sesion` | Estado de la sesión y del almacenamiento |
| `DELETE` | `/api/admin/sesion` | Cierra la sesión |
| `GET` | `/api/admin/productos` | Todos los productos, incluidos los pausados |
| `POST` | `/api/admin/imagenes` | Firma un token de subida directa al Blob |
| `DELETE` | `/api/admin/imagenes?url=…` | Borra una foto del Blob |
| `GET` | `/api/admin/instagram` | Estado de la sincronización y última corrida |
| `POST` | `/api/admin/instagram` | Busca novedades ahora |
| `PUT` | `/api/admin/instagram` | Prueba de conexión, sin llamar a Gemini ni guardar |
| `POST` | `/api/admin/propuestas/:id` | Aprueba y publica la propuesta |
| `DELETE` | `/api/admin/propuestas/:id` | Descarta la propuesta |
| `POST` | `/api/admin/productos` | Crea un producto |
| `PATCH` | `/api/admin/productos` | Reordena en lote |
| `PUT` | `/api/admin/productos/:id` | Reemplaza un producto |
| `PATCH` | `/api/admin/productos/:id` | Cambio puntual (precio, stock, orden) |
| `DELETE` | `/api/admin/productos/:id` | Elimina un producto |
| `GET` `PUT` | `/api/admin/ajustes` | Lee y guarda los ajustes de entrega |
| `DELETE` | `/api/admin/ajustes` | Restablece el catálogo original |

Los errores de validación vuelven con `422` y un mensaje en español que dice qué campo arreglar.

---

## Cómo está hecho

```
src/
├── app/
│   ├── page.tsx                  Portada
│   ├── catalogo/                 Catálogo con filtro por grupo
│   ├── producto/[slug]/          Ficha indexable, una URL por producto
│   ├── pedido/                   Datos del pedido y confirmación
│   ├── admin/                    Panel
│   ├── api/                      Catálogo público y administración
│   ├── sitemap.ts · robots.ts    SEO técnico
│   └── globals.css               Sistema de diseño en tokens de Tailwind v4
├── components/                   Interfaz, agrupada por función
└── lib/
    ├── site.ts                   Datos duros del negocio
    ├── catalog-seed.ts           Catálogo inicial, tomado de Instagram
    ├── store.ts                  Almacenamiento con tres controladores
    ├── whatsapp.ts               Armado del mensaje y del link wa.me
    ├── jsonld.ts                 Datos estructurados
    ├── auth.ts                   Sesión del panel
    └── validate.ts               Validación de la API
```

**Decisiones que valen la pena contar**

- **El catálogo se renderiza en el servidor.** El contenido nunca existe sólo en el cliente, así que
  Google lo ve entero. Las fichas de producto se generan estáticamente y se revalidan cada dos
  minutos, o al instante cuando el panel guarda un cambio.
- **Sin librería de estado ni de formularios.** El carrito son 150 líneas de contexto de React sobre
  `localStorage`; el checkout, un `useState` con validación derivada. Menos JavaScript en el
  navegador, menos que mantener.
- **Los iconos van inline.** Lucide y Simple Icons dibujados como SVG en un componente: no hay
  fuente de iconos ni sprite que descargar.
- **Sin dependencias de servidor.** El cliente de Redis son dos `fetch`. `package.json` tiene cuatro
  dependencias de producción, contando Next y React.

### Sistema de diseño

Los tokens salen del sistema de diseño de la marca y se exponen a Tailwind v4 con `@theme`, así que
las utilidades (`bg-cream-100`, `text-brown-900`) y las variables CSS (`--cream-100`) son la misma
fuente de verdad.

| | |
| --- | --- |
| **Fondo** | Crema `#FBF6EE`, marfil `#FFFDF9` para tarjetas |
| **Texto** | Marrón chocolate `#3A2A20` con dos atenuaciones |
| **Acentos** | Dorado `#C9A227` sólo decorativo (nunca como texto sobre crema, no llega a AA), rosa frutilla `#D97A86` para estados y WhatsApp |
| **Tipografías** | Prata para títulos, Instrument Sans para todo lo demás. Precios con `tabular-nums` |
| **Movimiento** | Salida suave `cubic-bezier(.22,.61,.36,1)`, nada rebota, todo se anula con `prefers-reduced-motion` |

---

## SEO

- Metadatos y Open Graph propios por página y por producto, con la foto del producto como imagen social.
- JSON-LD: `Bakery` con zonas de cobertura y catálogo, `Product` + `Offer`/`AggregateOffer` por
  producto, `FAQPage` y `BreadcrumbList`.
- Sitemap dinámico que se arma desde el catálogo, `robots.txt`, y `llms.txt` para los buscadores con IA.
- Una URL por producto, con slug en español: `/producto/cheesecake-de-dulce-de-leche`.
- Términos que cubre el contenido: *pastelería artesanal Montevideo*, *cheesecake por encargo
  Montevideo*, *tortas por encargo con envío*, *scones caseros*.
- Fotos WebP servidas por `next/image` en AVIF/WebP, con `alt` que describe lo que realmente se ve
  —«scones de queso apilados en una tabla redonda de madera, con luz de tarde»—, nunca «foto de producto».
- **No se publican reseñas con estrellas.** La cuenta tiene mensajes de clientas, pero ninguna
  calificación: inventar un `aggregateRating` sería mentirle a Google y a quien lee.

---

## Pendientes con Fátima

Cosas que el sitio deja marcadas en lugar de resolverlas por su cuenta:

- **Formas de pago y seña.** No están publicadas en ningún lado. La FAQ deriva a WhatsApp.
- **Conservación de cada producto.** Mismo caso.
- **Permiso para las reseñas.** Los tres mensajes son reales y salen de la historia destacada, pero
  no están firmados. Conviene pedirle nombre y permiso a cada clienta antes de dejarlos publicados.
- **Precio del tiramisú y de las cookies.** Se muestran como «Consultar». En cuanto haya precio, se
  carga desde el panel.
- **El logotipo es un JPG de 1080 px.** Alcanza para pantalla. Para impresión o para ponerlo sobre
  foto hace falta el vector original.

---

## Créditos

Fotografías, recetas y marca: **Fátima** — [@faticastro001](https://www.instagram.com/faticastro001/), Montevideo, Uruguay.

Diseño y desarrollo: **[Eduardo Airaudo](https://www.linkedin.com/in/eduardo-airaudo/)**.

Iconos de [Lucide](https://lucide.dev) (MIT) y [Simple Icons](https://simpleicons.org) (CC0).
Tipografías [Prata](https://fonts.google.com/specimen/Prata) e
[Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans), de Google Fonts.

Código bajo [licencia MIT](LICENSE). El contenido de la marca, no: ver la nota al pie de la licencia.
