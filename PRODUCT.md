# PRODUCT.md — Fátima, Pastelería Artesanal

> Contexto de producto duradero. Lo que cambia seguido vive en el panel, no acá.
> Redactado a partir del archivo de Instagram (`catalogo.md`, `media/`, `historias/`,
> `perfil/`) y del sistema de diseño en `design/`. Las suposiciones están marcadas.

## Qué es

Sitio público de pedidos de una pastelería casera de una sola persona, en Montevideo,
Uruguay. Vende cheesecakes, tortas y tartas, scones y galletería, todo por encargo, con
retiro o envío dentro de la ciudad.

**Mecanismo propio:** el sitio no procesa pedidos, los redacta. Convierte una elección de
catálogo en un mensaje de WhatsApp completo y ordenado, que es exactamente el canal donde
el negocio ya opera.

## Quién lo usa

- **Clienta que ya la sigue en Instagram.** Sabe qué hace, quiere saber cuánto sale y si
  llega a su barrio. Entra desde el link de la bio, en el teléfono.
- **Alguien que busca "torta por encargo Montevideo" en Google.** No conoce la marca.
  Necesita entender en diez segundos qué se vende, a cuánto y cómo se pide.
- **Fátima.** Entra al panel desde el teléfono para cambiar un precio o marcar que esta
  semana no hay scones.

## Qué tiene que lograr

1. Que se entienda el catálogo y el precio sin escribir un mensaje.
2. Que el pedido llegue por WhatsApp ya redactado, con fecha y modalidad decididas.
3. Que aparezca en Google para búsquedas locales de repostería por encargo.
4. Que Fátima pueda mantener precios y disponibilidad sola.

## Restricciones

- **No hay pago en línea.** Ni pasarela, ni seña, ni tarjeta. Se coordina por WhatsApp.
- **No hay cuentas ni login** del lado público. El carrito vive en el navegador.
- **No se inventan datos comerciales.** Precios, zonas, plazos y reseñas salen del archivo
  de Instagram. Lo que no está publicado se muestra como "Consultar" o deriva a WhatsApp.
- **Anticipación de 48 hs** para todo el catálogo.
- **Entregas a partir de las 19 h**, coordinadas por WhatsApp.
- **Español rioplatense, voseo, primera persona del singular.** Habla Fátima, no una empresa.
- Fuera de alcance: blog, multi-idioma, app, checkout con tarjeta, cuentas de cliente.

## Datos duros

| | |
| --- | --- |
| WhatsApp | 096 247 822 (`wa.me/59896247822`) |
| Instagram | [@faticastro001](https://www.instagram.com/faticastro001/) |
| Base | Aguada y La Comercial, Montevideo |
| Envío | $ 100 a La Comercial, Aguada, Tres Cruces, Nuevo Centro, Av. Italia y Parque Batlle |
| Retiro | Sin costo, en Aguada o La Comercial |
| Lema | "El sabor de lo hecho en casa." |
| Moneda | Peso uruguayo, punto de miles, sin decimales: `$ 1.100` |

## Compromisos de marca

- Paleta, tipografías y componentes vienen del sistema de diseño entregado en `design/`.
  Son una instrucción del brief, no una elección de este proyecto. Ver `DESIGN.md`.
- **Sin emoji en la interfaz.** Los emoji son voz de Instagram y no cruzan al sitio. Sí se
  respetan dentro de citas textuales.
- Sin exclamaciones, sin diminutivos y sin mayúsculas de énfasis en el copy de la interfaz.
  En las reseñas y en los textos copiados de Instagram se respeta el original.
- Las fotos son de ella, con teléfono y luz natural. **No se les aplica filtro, duotono,
  blanco y negro ni grano**: sólo se recortan.

## Suposiciones declaradas

El cliente pidió explícitamente no hacer preguntas, así que lo siguiente se resolvió por
evidencia y queda anotado para revisar:

1. **Tres grupos de catálogo** (Cheesecakes · Tortas y tartas · Scones y galletería) en
   lugar de los tres del brief original, porque la cuenta vende además cookies, alfajores
   y brownies.
2. **Reseñas sin puntaje ni firma.** Son mensajes reales de la historia destacada, pero no
   hay calificación publicada ni nombre. No se emite `aggregateRating`.
3. **Formas de pago, seña y conservación** no están publicadas: la FAQ deriva a WhatsApp en
   vez de inventar una política.
4. **Contraseña del panel en el repositorio** (`667703`), por pedido explícito. El código es
   abierto, así que es pública: el README y el propio panel insisten en reemplazarla con
   `ADMIN_PASSWORD`.
