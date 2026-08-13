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
| 🔌 **API pública** | `/api/productos` sirve el catálogo en JSON, listo para sincronizar con Instagram u otro canal más adelante. |
| 🔍 **SEO y GEO** | Metadatos por producto, JSON-LD (`Bakery`, `Product`, `Offer`, `FAQPage`, `BreadcrumbList`), sitemap dinámico, `robots.txt` y `llms.txt`. |
| ♿ **Accesible** | Contraste AA, foco visible, objetivos de toque de 44 px, navegación por teclado, `prefers-reduced-motion` respetado. |

---

## Puesta en marcha

```bash
git clone https://github.com/<tu-usuario>/fatima-pasteleria.git
cd fatima-pasteleria
npm install
cp .env.example .env.local   # opcional en desarrollo
npm run dev
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
| `NEXT_PUBLIC_SITE_URL` | Recomendada | URL canónica del sitio. Sin ella, los metadatos y el sitemap apuntan al dominio por defecto. |
| `ADMIN_PASSWORD` | **Sí, en producción** | Contraseña del panel. Sin definirla se usa la del repositorio, que es pública. |
| `ADMIN_SESSION_SECRET` | Recomendada | Firma la cookie de sesión del panel. Cadena larga y aleatoria. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Recomendada | Persistencia del catálogo. También sirven `KV_REST_API_URL` / `KV_REST_API_TOKEN`. |
| `BLOB_READ_WRITE_TOKEN` | Alternativa | Persistencia con Vercel Blob. La inyecta Vercel al conectar un Blob store; no hay que escribirla a mano. |

### Persistencia del catálogo

> **Un clic pendiente.** Recién desplegado, el sitio corre con el controlador de memoria: se ve y
> se pide perfecto, pero los cambios del panel se pierden cuando el servidor se reinicia. Para que
> queden guardados alcanza con conectar un almacenamiento; no hay que tocar código.
>
> **Camino más corto:** Vercel → **Storage** → *Connect Store* → **Blob** (ya existe uno creado con
> el nombre `fatima-catalogo`) → conectarlo al proyecto → **Redeploy**. Vercel inyecta
> `BLOB_READ_WRITE_TOKEN` y el sitio cambia de controlador solo.

El catálogo se guarda con el primer controlador disponible:

| Controlador | Se activa con | Dónde sirve |
| --- | --- | --- |
| **Redis por REST** | `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (o el par `KV_REST_API_*`) | Producción. Lo más rápido de leer. Se crea gratis desde Vercel → Storage → Upstash Redis |
| **Vercel Blob** | `BLOB_READ_WRITE_TOKEN` | Producción. Es el que aparece solo al conectar un Blob store al proyecto |
| **Archivo** | Nada: es el modo por defecto fuera de Vercel | Desarrollo local. Escribe `data/catalog.json`, ignorado por git |
| **Memoria** | Nada: es el último recurso | Respaldo. El panel lo avisa con una franja amarilla |

Cada guardado en Blob sube un archivo nuevo con marca de tiempo y borra los anteriores salvo los
dos últimos: así la URL cambia en cada cambio y nunca se lee una versión vieja del CDN.

El cliente de Redis son dos `fetch`, sin dependencias.

---

## Panel de administración

`/admin`, con contraseña. Desde ahí se puede:

- cambiar el precio de cualquier opción y el nombre, el resumen y la descripción;
- pausar un producto («esta semana no hay») sin borrarlo;
- crear y eliminar productos, con sus fotos y textos alternativos;
- destacar productos en la portada y ordenarlos dentro de su grupo;
- ajustar el costo de envío, la anticipación mínima, la hora de entrega y el WhatsApp;
- publicar un aviso en la franja superior del sitio (vacaciones, tanda especial);
- volver al catálogo original publicado en Instagram.

Cada cambio revalida las páginas afectadas, así que se ve en el sitio al instante.

> ### ⚠️ Seguridad del panel
>
> La contraseña por defecto (`667703`) está en el código **a pedido del cliente**, y como el
> repositorio es abierto, es pública. Antes de compartir la URL con alguien más:
>
> 1. definí `ADMIN_PASSWORD` en Vercel con una contraseña propia;
> 2. definí `ADMIN_SESSION_SECRET` con una cadena aleatoria;
> 3. redesplegá.
>
> El panel muestra un aviso mientras siga usando la contraseña por defecto. La sesión es una
> cookie `httpOnly` firmada con HMAC-SHA256 que vence a las 12 horas, la comparación de la
> contraseña es de tiempo constante y hay límite de intentos por IP. Aun así, una contraseña
> pública es una contraseña pública.

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
      "badge": "Cantidad limitada"
    }
  ],
  "settings": { "shippingCost": 100, "leadTimeHours": 48, "deliveryFromHour": 19 }
}
```

`price: null` significa **sin precio publicado**: la interfaz lo muestra como «Consultar».

### Administración

Todas piden la cookie de sesión que emite `POST /api/admin/sesion`.

| Método | Ruta | Qué hace |
| --- | --- | --- |
| `POST` | `/api/admin/sesion` | Inicia sesión con `{ "password": "…" }` |
| `GET` | `/api/admin/sesion` | Estado de la sesión y del almacenamiento |
| `DELETE` | `/api/admin/sesion` | Cierra la sesión |
| `GET` | `/api/admin/productos` | Todos los productos, incluidos los pausados |
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
