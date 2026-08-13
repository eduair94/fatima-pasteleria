/* @ds-bundle: {"format":4,"namespace":"FTimaPastelerADesignSystem_869e9d","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"PhotoFrame","sourcePath":"components/brand/PhotoFrame.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"CartBar","sourcePath":"components/commerce/CartBar.jsx"},{"name":"CartLine","sourcePath":"components/commerce/CartLine.jsx"},{"name":"LeadTimeNote","sourcePath":"components/commerce/LeadTimeNote.jsx"},{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"QuantityStepper","sourcePath":"components/commerce/QuantityStepper.jsx"},{"name":"Order","sourcePath":"components/commerce/order.js"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Accordion","sourcePath":"components/feedback/Accordion.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"ReviewCard","sourcePath":"components/feedback/ReviewCard.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"DateField","sourcePath":"components/forms/DateField.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Icon","sourcePath":"components/icon/Icon.jsx"},{"name":"ICONS","sourcePath":"components/icon/icons.data.js"},{"name":"ICON_NAMES","sourcePath":"components/icon/icons.data.js"}],"sourceHashes":{"components/brand/Logo.jsx":"9d49319d2416","components/brand/PhotoFrame.jsx":"6981a013e70f","components/brand/Wordmark.jsx":"4671e1ac4f2b","components/commerce/CartBar.jsx":"318c650f5f3b","components/commerce/CartLine.jsx":"545f4765ba5c","components/commerce/LeadTimeNote.jsx":"784ed5ebb909","components/commerce/ProductCard.jsx":"d6bc1f4ee919","components/commerce/QuantityStepper.jsx":"0eabe8f2a724","components/commerce/order.js":"0164b373385c","components/core/Badge.jsx":"664670e8dc71","components/core/Button.jsx":"2953ade86a03","components/core/Card.jsx":"87588508cfb4","components/core/Chip.jsx":"4a95e99c1371","components/core/IconButton.jsx":"e16c3fa30f9a","components/core/SectionHeading.jsx":"52f8682e6e85","components/feedback/Accordion.jsx":"95e999983d8e","components/feedback/Alert.jsx":"1da5a93486c5","components/feedback/Modal.jsx":"7d3c18170a3e","components/feedback/ReviewCard.jsx":"ac0b2e7c32da","components/forms/Checkbox.jsx":"d84ce81840d2","components/forms/DateField.jsx":"fdca1f0e025c","components/forms/Field.jsx":"0f5f9a1ca717","components/forms/Input.jsx":"cfadb10a3051","components/forms/RadioGroup.jsx":"52105b983811","components/forms/Select.jsx":"a4907acdb4cc","components/forms/Textarea.jsx":"b174ad145374","components/icon/Icon.jsx":"a0072f6fafbc","components/icon/icons.data.js":"841e8b8c3f5b","ui_kits/sitio-publico/App.jsx":"761cc48563a7","ui_kits/sitio-publico/Catalogo.jsx":"570a4ed56abc","ui_kits/sitio-publico/Ficha.jsx":"da3af232c932","ui_kits/sitio-publico/Layout.jsx":"6236db8a2acf","ui_kits/sitio-publico/Pedido.jsx":"20d5c3328f64","ui_kits/sitio-publico/Producto.jsx":"bd0ef210b636","ui_kits/sitio-publico/data.js":"0ce9f75974bf"},"inlinedExternals":[],"unexposedExports":[{"name":"buildLink","sourcePath":"components/commerce/order.js"},{"name":"buildMessage","sourcePath":"components/commerce/order.js"},{"name":"formatDate","sourcePath":"components/commerce/order.js"},{"name":"formatPrice","sourcePath":"components/commerce/order.js"},{"name":"maxLeadDays","sourcePath":"components/commerce/order.js"}]} */

(() => {

const __ds_ns = (window.FTimaPastelerADesignSystem_869e9d = window.FTimaPastelerADesignSystem_869e9d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
/* Sello circular original de la marca (assets/brand/logo-sello.png, recorte
   circular del JPG de la cuenta). No se redibuja ni se recolorea: se usa tal cual
   sobre crema. Sobre marrón o foto, usar Wordmark en su lugar. */
function Logo({
  size = 96,
  src = "assets/brand/logo-sello.png",
  href,
  alt = "Fátima — Pastelería Artesanal. El sabor de lo hecho en casa.",
  className,
  style
}) {
  const img = /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    width: size,
    height: size,
    style: {
      display: "block",
      width: size,
      height: size,
      borderRadius: "var(--radius-circle)",
      ...style
    }
  });
  return href ? /*#__PURE__*/React.createElement("a", {
    href: href,
    className: className,
    style: {
      display: "inline-block",
      lineHeight: 0
    }
  }, img) : img;
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/PhotoFrame.jsx
try { (() => {
function PhotoFrame({
  src,
  alt,
  slotId,
  ratio = "4/3",
  rounded = false,
  scrim = "none",
  loading = "eager",
  children,
  caption,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("figure", {
    className: ["fp-photo", rounded && "fp-photo--rounded", className].filter(Boolean).join(" "),
    style: {
      margin: 0,
      aspectRatio: ratio,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    loading: loading,
    fetchpriority: loading === "eager" ? "high" : undefined,
    decoding: "async"
  }) : slotId ? React.createElement("image-slot", {
    id: slotId,
    placeholder: alt || "Foto"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "fp-ph"
  }, "Foto"), scrim !== "none" ? /*#__PURE__*/React.createElement("span", {
    className: ["fp-photo__scrim", scrim === "top" && "fp-photo__scrim--top"].filter(Boolean).join(" ")
  }) : null, children ? /*#__PURE__*/React.createElement("div", {
    className: "fp-photo__content"
  }, children) : null, caption ? /*#__PURE__*/React.createElement("figcaption", {
    className: "fp-photo__caption"
  }, caption) : null);
}
Object.assign(__ds_scope, { PhotoFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/PhotoFrame.jsx", error: String((e && e.message) || e) }); }

// components/brand/Wordmark.jsx
try { (() => {
/* Lockup tipográfico de la marca, para donde el sello no entra: headers
   angostos, fondos oscuros, fotografía. El sello original vive en Logo. */
function Wordmark({
  size = 28,
  tagline = "Pastelería Artesanal",
  inverse = false,
  layout = "stack",
  href,
  className,
  style
}) {
  const cls = ["fp-wordmark", inverse && "fp-wordmark--inverse", layout === "row" && "fp-wordmark--row", className].filter(Boolean).join(" ");
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "fp-wordmark__name",
    style: {
      fontSize: size
    }
  }, "F\xE1tima"), tagline ? /*#__PURE__*/React.createElement("span", {
    className: "fp-wordmark__tag",
    style: {
      fontSize: Math.max(9, Math.round(size * 0.31))
    }
  }, tagline) : null);
  return href ? /*#__PURE__*/React.createElement("a", {
    className: cls,
    href: href,
    style: style,
    "aria-label": "Fátima " + (tagline || "")
  }, content) : /*#__PURE__*/React.createElement("span", {
    className: cls,
    style: style
  }, content);
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/commerce/order.js
try { (() => {
/* Lógica de pedido: formato de precios en pesos uruguayos y armado del mensaje
   de WhatsApp. Sin dependencias; sirve igual en el sitio y en los prototipos. */

function formatPrice(value) {
  if (value === null || value === undefined) return "Consultar";
  if (value === 0) return "Sin costo";
  return "$\u00A0" + new Intl.NumberFormat("es-UY", {
    maximumFractionDigits: 0
  }).format(value);
}
function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-UY", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

/* Mensaje del pedido. Orden fijo: encabezado, ítems, subtotal, envío, total,
   fecha, modalidad, dirección, comentarios. */
function buildMessage(order) {
  const o = order || {};
  const items = o.items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = o.mode === "envio" ? o.shippingCost || 0 : 0;
  const L = [];
  L.push("Hola Fátima, quiero hacer un pedido.");
  L.push("");
  L.push("Nombre: " + (o.name || ""));
  L.push("Teléfono: " + (o.phone || ""));
  L.push("");
  L.push("Pedido:");
  items.forEach(i => {
    const variant = i.variant ? " (" + i.variant + ")" : "";
    const note = i.note ? " — " + i.note : "";
    L.push("· " + i.qty + " x " + i.name + variant + note + " — " + formatPrice(i.price * i.qty));
  });
  L.push("");
  L.push("Subtotal: " + formatPrice(subtotal));
  if (o.mode === "envio") L.push("Envío (" + (o.zone || "a confirmar") + "): " + formatPrice(shipping));
  L.push("Total: " + formatPrice(subtotal + shipping));
  L.push("");
  L.push("Fecha de entrega: " + formatDate(o.date));
  L.push("Modalidad: " + (o.mode === "envio" ? "Envío" : "Retiro"));
  if (o.mode === "envio" && o.address) L.push("Dirección: " + o.address + (o.zone ? " (" + o.zone + ")" : ""));
  if (o.comments) L.push("Comentarios: " + o.comments);
  return L.join("\n");
}
function buildLink(order, phone) {
  return "https://wa.me/" + (phone || "59800000000") + "?text=" + encodeURIComponent(buildMessage(order));
}

/* Anticipación mínima del carrito: manda el ítem de mayor plazo. */
function maxLeadDays(items) {
  return (items || []).reduce((max, i) => Math.max(max, i.leadDays || 0), 0);
}

/* Expuesto también como objeto para consumirlo desde el bundle del sistema. */
const Order = {
  formatPrice,
  formatDate,
  buildMessage,
  buildLink,
  maxLeadDays
};
Object.assign(__ds_scope, { formatPrice, formatDate, buildMessage, buildLink, maxLeadDays, Order });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/order.js", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  variant = "default",
  padding = "md",
  interactive = false,
  as = "div",
  className,
  style,
  ...rest
}) {
  const Tag = as;
  const cls = ["fp-card", variant !== "default" && "fp-card--" + variant, padding === "md" && "fp-card--pad", padding === "lg" && "fp-card--pad-lg", interactive && "fp-card--interactive", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    style: style
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
  rule = true,
  as = "h2",
  className,
  style
}) {
  const Tag = as;
  const cls = ["fp-heading", align === "center" && "fp-heading--center", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: style
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    className: "fp-heading__eyebrow"
  }, eyebrow) : null, /*#__PURE__*/React.createElement(Tag, {
    className: "fp-heading__title"
  }, title), rule ? /*#__PURE__*/React.createElement("hr", {
    className: "fp-heading__rule"
  }) : null, sub ? /*#__PURE__*/React.createElement("p", {
    className: "fp-heading__sub"
  }, sub) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/icon/icons.data.js
try { (() => {
// Generated from assets/icons/*.svg — Lucide (stroke) + Simple Icons (fill, marcas).
// Do not hand-edit; re-run the extraction if you add icons to assets/icons/.
const ICONS = {
  "arrow-right": {
    fill: false,
    body: "<path d=\"M5 12h14\"></path> <path d=\"m12 5 7 7-7 7\"></path>"
  },
  "banknote": {
    fill: false,
    body: "<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"2\"></rect> <circle cx=\"12\" cy=\"12\" r=\"2\"></circle> <path d=\"M6 12h.01M18 12h.01\"></path>"
  },
  "cake-slice": {
    fill: false,
    body: "<path d=\"M16 13H3\"></path> <path d=\"M16 17H3\"></path> <path d=\"m7.2 7.9-3.388 2.5A2 2 0 0 0 3 12.01V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8.654c0-2-2.44-6.026-6.44-8.026a1 1 0 0 0-1.082.057L10.4 5.6\"></path> <circle cx=\"9\" cy=\"7\" r=\"2\"></circle>"
  },
  "calendar": {
    fill: false,
    body: "<path d=\"M8 2v3\"></path> <path d=\"M16 2v3\"></path> <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect> <path d=\"M3 9h18\"></path>"
  },
  "check": {
    fill: false,
    body: "<path d=\"M20 6 9 17l-5-5\"></path>"
  },
  "chevron-down": {
    fill: false,
    body: "<path d=\"m6 9 6 6 6-6\"></path>"
  },
  "chevron-left": {
    fill: false,
    body: "<path d=\"m15 18-6-6 6-6\"></path>"
  },
  "chevron-right": {
    fill: false,
    body: "<path d=\"m9 18 6-6-6-6\"></path>"
  },
  "circle-alert": {
    fill: false,
    body: "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle> <line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\"></line> <line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\"></line>"
  },
  "circle-check-big": {
    fill: false,
    body: "<path d=\"M21.801 10A10 10 0 1 1 17 3.335\"></path> <path d=\"m9 11 3 3L22 4\"></path>"
  },
  "clock": {
    fill: false,
    body: "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle> <path d=\"M12 6v6l4 2\"></path>"
  },
  "cookie": {
    fill: false,
    body: "<path d=\"M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5\"></path> <path d=\"M8.5 8.5v.01\"></path> <path d=\"M16 15.5v.01\"></path> <path d=\"M12 12v.01\"></path> <path d=\"M11 17v.01\"></path> <path d=\"M7 14v.01\"></path>"
  },
  "croissant": {
    fill: false,
    body: "<path d=\"M10.2 18H4.774a1.5 1.5 0 0 1-1.352-.97 11 11 0 0 1 .132-6.487\"></path> <path d=\"M18 10.2V4.774a1.5 1.5 0 0 0-.97-1.352 11 11 0 0 0-6.486.132\"></path> <path d=\"M18 5a4 3 0 0 1 4 3 2 2 0 0 1-2 2 10 10 0 0 0-5.139 1.42\"></path> <path d=\"M5 18a3 4 0 0 0 3 4 2 2 0 0 0 2-2 10 10 0 0 1 1.42-5.14\"></path> <path d=\"M8.709 2.554a10 10 0 0 0-6.155 6.155 1.5 1.5 0 0 0 .676 1.626l9.807 5.42a2 2 0 0 0 2.718-2.718l-5.42-9.807a1.5 1.5 0 0 0-1.626-.676\"></path>"
  },
  "heart": {
    fill: false,
    body: "<path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\"></path>"
  },
  "info": {
    fill: false,
    body: "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle> <path d=\"M12 16v-4\"></path> <path d=\"M12 8h.01\"></path>"
  },
  "instagram": {
    fill: true,
    body: "<title>Instagram</title><path d=\"M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077\"></path>"
  },
  "map-pin": {
    fill: false,
    body: "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"></path> <circle cx=\"12\" cy=\"10\" r=\"3\"></circle>"
  },
  "menu": {
    fill: false,
    body: "<path d=\"M4 5h16\"></path> <path d=\"M4 12h16\"></path> <path d=\"M4 19h16\"></path>"
  },
  "message-circle": {
    fill: false,
    body: "<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\"></path>"
  },
  "minus": {
    fill: false,
    body: "<path d=\"M5 12h14\"></path>"
  },
  "pencil-line": {
    fill: false,
    body: "<path d=\"M13 21h8\"></path> <path d=\"m15 5 4 4\"></path> <path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"></path>"
  },
  "phone": {
    fill: false,
    body: "<path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\"></path>"
  },
  "plus": {
    fill: false,
    body: "<path d=\"M5 12h14\"></path> <path d=\"M12 5v14\"></path>"
  },
  "shopping-bag": {
    fill: false,
    body: "<path d=\"M16 10a4 4 0 0 1-8 0\"></path> <path d=\"M3.103 6.034h17.794\"></path> <path d=\"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z\"></path>"
  },
  "snowflake": {
    fill: false,
    body: "<path d=\"m10 20-1.25-2.5L6 18\"></path> <path d=\"M10 4 8.75 6.5 6 6\"></path> <path d=\"m14 20 1.25-2.5L18 18\"></path> <path d=\"m14 4 1.25 2.5L18 6\"></path> <path d=\"m17 21-3-6h-4\"></path> <path d=\"m17 3-3 6 1.5 3\"></path> <path d=\"M2 12h6.5L10 9\"></path> <path d=\"m20 10-1.5 2 1.5 2\"></path> <path d=\"M22 12h-6.5L14 15\"></path> <path d=\"m4 10 1.5 2L4 14\"></path> <path d=\"m7 21 3-6-1.5-3\"></path> <path d=\"m7 3 3 6h4\"></path>"
  },
  "star": {
    fill: false,
    body: "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"></path>"
  },
  "store": {
    fill: false,
    body: "<path d=\"M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5\"></path> <path d=\"M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244\"></path> <path d=\"M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05\"></path>"
  },
  "trash-2": {
    fill: false,
    body: "<path d=\"M10 11v6\"></path> <path d=\"M14 11v6\"></path> <path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"></path> <path d=\"M3 6h18\"></path> <path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path>"
  },
  "truck": {
    fill: false,
    body: "<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\"></path> <path d=\"M15 18H9\"></path> <path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\"></path> <circle cx=\"17\" cy=\"18\" r=\"2\"></circle> <circle cx=\"7\" cy=\"18\" r=\"2\"></circle>"
  },
  "whatsapp": {
    fill: true,
    body: "<title>WhatsApp</title><path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z\"></path>"
  },
  "x": {
    fill: false,
    body: "<path d=\"M18 6 6 18\"></path> <path d=\"m6 6 12 12\"></path>"
  }
};
const ICON_NAMES = ["arrow-right", "banknote", "cake-slice", "calendar", "check", "chevron-down", "chevron-left", "chevron-right", "circle-alert", "circle-check-big", "clock", "cookie", "croissant", "heart", "info", "instagram", "map-pin", "menu", "message-circle", "minus", "pencil-line", "phone", "plus", "shopping-bag", "snowflake", "star", "store", "trash-2", "truck", "whatsapp", "x"];
Object.assign(__ds_scope, { ICONS, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icon/icons.data.js", error: String((e && e.message) || e) }); }

// components/icon/Icon.jsx
try { (() => {
/* Único envoltorio de iconografía del sistema. Los glifos vienen de
   assets/icons (Lucide, trazo 2px) más las marcas Instagram/WhatsApp (Simple Icons, relleno). */
function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  color = "currentColor",
  label,
  style,
  className
}) {
  const glyph = __ds_scope.ICONS[name];
  if (!glyph) return null;
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    role: label ? "img" : "presentation",
    "aria-label": label || undefined,
    "aria-hidden": label ? undefined : true,
    focusable: "false",
    className,
    style: {
      display: "block",
      flex: "0 0 auto",
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: glyph.body
    }
  };
  const paint = glyph.fill ? {
    fill: color,
    stroke: "none"
  } : {
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  return React.createElement("svg", {
    ...common,
    ...paint
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icon/Icon.jsx", error: String((e && e.message) || e) }); }

// components/commerce/LeadTimeNote.jsx
try { (() => {
function LeadTimeNote({
  children,
  hours,
  icon = "clock",
  plain = false,
  className,
  style
}) {
  const text = children || (hours ? hours + " hs de anticipación mínima" : null);
  return /*#__PURE__*/React.createElement("p", {
    className: ["fp-lead", plain && "fp-lead--plain", className].filter(Boolean).join(" "),
    style: style
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), text);
}
Object.assign(__ds_scope, { LeadTimeNote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/LeadTimeNote.jsx", error: String((e && e.message) || e) }); }

// components/commerce/QuantityStepper.jsx
try { (() => {
function QuantityStepper({
  value = 1,
  onChange,
  min = 1,
  max = 20,
  size = "md",
  label = "Cantidad",
  className,
  style
}) {
  const set = n => {
    if (onChange && n >= min && n <= max) onChange(n);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: ["fp-stepper", size === "sm" && "fp-stepper--sm", className].filter(Boolean).join(" "),
    style: style,
    role: "group",
    "aria-label": label
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "fp-stepper__btn",
    onClick: () => set(value - 1),
    disabled: value <= min,
    "aria-label": "Quitar uno"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "minus",
    size: size === "sm" ? 15 : 18,
    strokeWidth: 2
  })), /*#__PURE__*/React.createElement("span", {
    className: "fp-stepper__value",
    "aria-live": "polite"
  }, value), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "fp-stepper__btn",
    onClick: () => set(value + 1),
    disabled: value >= max,
    "aria-label": "Agregar uno"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: size === "sm" ? 15 : 18,
    strokeWidth: 2
  })));
}
Object.assign(__ds_scope, { QuantityStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/QuantityStepper.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function Badge({
  children,
  tone = "neutral",
  icon,
  className,
  style
}) {
  const cls = ["fp-badge", "fp-badge--" + tone, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", {
    className: cls,
    style: style
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 13,
    strokeWidth: 2
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  href,
  iconLeft,
  iconRight,
  disabled = false,
  type = "button",
  onClick,
  className,
  style,
  ...rest
}) {
  const cls = ["fp-btn", "fp-btn--" + variant, size !== "md" && "fp-btn--" + size, block && "fp-btn--block", className].filter(Boolean).join(" ");
  const inner = [iconLeft ? /*#__PURE__*/React.createElement("span", {
    className: "fp-btn__icon",
    key: "l"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: size === "sm" ? 16 : 20
  })) : null, /*#__PURE__*/React.createElement("span", {
    key: "t"
  }, children), iconRight ? /*#__PURE__*/React.createElement("span", {
    className: "fp-btn__icon",
    key: "r"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: size === "sm" ? 16 : 20
  })) : null];
  if (href && !disabled) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href,
      style: style
    }, rest), inner);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: style
  }, rest), inner);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/commerce/CartBar.jsx
try { (() => {
function CartBar({
  count = 0,
  total = 0,
  cta = "Ver pedido",
  onCta,
  hidden = false,
  className,
  style
}) {
  if (hidden || count === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: ["fp-cartbar", className].filter(Boolean).join(" "),
    style: style,
    role: "region",
    "aria-label": "Pedido"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "shopping-bag",
    size: 22,
    color: "var(--gold-200)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "fp-cartbar__info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fp-cartbar__count"
  }, count === 1 ? "1 ítem" : count + " ítems"), /*#__PURE__*/React.createElement("span", {
    className: "fp-cartbar__total"
  }, __ds_scope.formatPrice(total))), /*#__PURE__*/React.createElement("span", {
    className: "fp-cartbar__cta"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "gold",
    onClick: onCta
  }, cta)));
}
Object.assign(__ds_scope, { CartBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/CartBar.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function Chip({
  children,
  selected = false,
  icon,
  onClick,
  className,
  style
}) {
  const cls = ["fp-chip", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: cls,
    "aria-pressed": selected,
    onClick: onClick,
    style: style
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }) : null, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  disabled = false,
  onClick,
  className,
  style,
  ...rest
}) {
  const cls = ["fp-iconbtn", "fp-iconbtn--" + variant, size === "sm" && "fp-iconbtn--sm", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    style: style
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === "sm" ? 18 : 20
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/commerce/CartLine.jsx
try { (() => {
function CartLine({
  name,
  variant,
  note,
  price,
  qty = 1,
  image,
  imageAlt,
  onQty,
  onRemove,
  onNote,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["fp-cartline", className].filter(Boolean).join(" "),
    style: style
  }, image ? /*#__PURE__*/React.createElement("img", {
    className: "fp-cartline__thumb",
    src: image,
    alt: imageAlt || name
  }) : /*#__PURE__*/React.createElement("span", {
    className: "fp-cartline__thumb"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fp-cartline__main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fp-cartline__name"
  }, name), variant ? /*#__PURE__*/React.createElement("span", {
    className: "fp-cartline__meta"
  }, variant) : null, note ? /*#__PURE__*/React.createElement("span", {
    className: "fp-cartline__meta"
  }, "Nota: ", note) : null, onNote ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "fp-cartline__note",
    onClick: onNote
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "pencil-line",
    size: 14
  }), note ? "Editar nota" : "Agregar nota") : null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.QuantityStepper, {
    value: qty,
    onChange: onQty,
    size: "sm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fp-cartline__side"
  }, onRemove ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "trash-2",
    label: "Quitar " + name,
    size: "sm",
    onClick: onRemove
  }) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", {
    className: "fp-cartline__price"
  }, __ds_scope.formatPrice(price * qty))));
}
Object.assign(__ds_scope, { CartLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/CartLine.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
function ProductCard({
  name,
  description,
  price,
  unit,
  image,
  imageAlt,
  slotId,
  loading = "eager",
  flag,
  flagTone = "gold",
  leadLabel,
  onOpen,
  onAdd,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: ["fp-prod", className].filter(Boolean).join(" "),
    style: style,
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("div", {
    className: "fp-prod__media"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt || name,
    loading: loading,
    decoding: "async"
  }) : slotId ? React.createElement("image-slot", {
    id: slotId,
    placeholder: "Foto de " + name
  }) : /*#__PURE__*/React.createElement("span", {
    className: "fp-ph"
  }, "Foto"), flag ? /*#__PURE__*/React.createElement("span", {
    className: "fp-prod__flag"
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: flagTone
  }, flag)) : null), /*#__PURE__*/React.createElement("div", {
    className: "fp-prod__body"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "fp-prod__name"
  }, name), description ? /*#__PURE__*/React.createElement("p", {
    className: "fp-prod__desc"
  }, description) : null, leadLabel ? /*#__PURE__*/React.createElement("span", {
    className: "fp-prod__unit"
  }, leadLabel) : null, /*#__PURE__*/React.createElement("div", {
    className: "fp-prod__foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fp-prod__price"
  }, __ds_scope.formatPrice(price), unit ? /*#__PURE__*/React.createElement("span", {
    className: "fp-prod__unit"
  }, " / ", unit) : null), onAdd ? /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onAdd();
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "plus",
    label: "Agregar " + name + " al pedido",
    variant: "outline",
    size: "sm"
  })) : null)));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Accordion.jsx
try { (() => {
function Accordion({
  items = [],
  defaultOpen = -1,
  single = true,
  className,
  style
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [multi, setMulti] = React.useState([]);
  const isOpen = i => single ? open === i : multi.includes(i);
  const toggle = i => {
    if (single) setOpen(open === i ? -1 : i);else setMulti(multi.includes(i) ? multi.filter(x => x !== i) : multi.concat(i));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: ["fp-acc", className].filter(Boolean).join(" "),
    style: style
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "fp-acc__item",
    key: i
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "fp-acc__btn",
    "aria-expanded": isOpen(i),
    onClick: () => toggle(i)
  }, it.q, /*#__PURE__*/React.createElement("span", {
    className: "fp-acc__caret"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 20
  }))), isOpen(i) ? /*#__PURE__*/React.createElement("div", {
    className: "fp-acc__panel"
  }, it.a) : null)));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
const TONE_ICON = {
  info: "info",
  ok: "circle-check-big",
  warn: "clock",
  error: "circle-alert"
};
function Alert({
  tone = "info",
  title,
  children,
  icon,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["fp-alert", "fp-alert--" + tone, className].filter(Boolean).join(" "),
    style: style,
    role: tone === "error" ? "alert" : undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "fp-alert__icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || TONE_ICON[tone],
    size: 17
  })), /*#__PURE__*/React.createElement("span", null, title ? /*#__PURE__*/React.createElement("span", {
    className: "fp-alert__title"
  }, title) : null, children));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
function Modal({
  open = true,
  title,
  eyebrow,
  onClose,
  children,
  footer,
  labelledBy = "fp-modal-title",
  className,
  style
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: ["fp-modal", className].filter(Boolean).join(" "),
    style: style,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": title ? labelledBy : undefined
  }, /*#__PURE__*/React.createElement("div", {
    className: "fp-modal__scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "fp-modal__sheet"
  }, onClose ? /*#__PURE__*/React.createElement("span", {
    className: "fp-modal__close"
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Cerrar",
    variant: "solid",
    onClick: onClose
  })) : null, title || eyebrow ? /*#__PURE__*/React.createElement("div", {
    className: "fp-modal__head"
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    className: "fp-heading__eyebrow"
  }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("h2", {
    className: "fp-modal__title",
    id: labelledBy
  }, title) : null) : null, /*#__PURE__*/React.createElement("div", {
    className: "fp-modal__body"
  }, children), footer ? /*#__PURE__*/React.createElement("div", {
    className: "fp-modal__foot"
  }, footer) : null));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ReviewCard.jsx
try { (() => {
function ReviewCard({
  text,
  author,
  meta,
  rating = 5,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("figure", {
    className: ["fp-review", className].filter(Boolean).join(" "),
    style: {
      margin: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "fp-review__stars",
    "aria-label": rating + " de 5"
  }, Array.from({
    length: rating
  }).map((_, i) => /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "star",
    size: 15,
    key: i,
    strokeWidth: 1
  }))), /*#__PURE__*/React.createElement("blockquote", {
    className: "fp-review__text",
    style: {
      margin: 0
    }
  }, text), /*#__PURE__*/React.createElement("figcaption", {
    className: "fp-review__by"
  }, author, meta ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "fp-review__dot"
  }), meta) : null));
}
Object.assign(__ds_scope, { ReviewCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ReviewCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  description,
  checked,
  onChange,
  name,
  value,
  disabled,
  card = false,
  className,
  style
}) {
  const cls = ["fp-check", card && "fp-check--card", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("label", {
    className: cls,
    style: {
      position: "relative",
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    name: name,
    value: value,
    disabled: disabled
  }), /*#__PURE__*/React.createElement("span", {
    className: "fp-check__box"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    strokeWidth: 2.5
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "fp-check__label"
  }, label), description ? /*#__PURE__*/React.createElement("span", {
    className: "fp-check__desc"
  }, description) : null));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
/* Envoltorio de etiqueta + ayuda + error. Lo usan Input, Textarea, Select y DateField. */
function Field({
  label,
  htmlFor,
  optional,
  help,
  error,
  children,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["fp-field", className].filter(Boolean).join(" "),
    style: style
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "fp-field__label",
    htmlFor: htmlFor
  }, label, optional ? /*#__PURE__*/React.createElement("span", {
    className: "fp-field__opt"
  }, " (opcional)") : null) : null, children, error ? /*#__PURE__*/React.createElement("span", {
    className: "fp-field__error"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-alert",
    size: 15,
    strokeWidth: 2
  }), error) : help ? /*#__PURE__*/React.createElement("span", {
    className: "fp-field__help"
  }, help) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/DateField.jsx
try { (() => {
/* Fecha de entrega. minLeadDays bloquea todo lo que caiga por debajo de la
   anticipación del producto de mayor plazo del carrito. */
function DateField({
  label = "Fecha de entrega",
  id = "fecha",
  value,
  onChange,
  minLeadDays = 0,
  maxDaysAhead = 90,
  error,
  help,
  name,
  disabled,
  className,
  style
}) {
  const pad = n => String(n).padStart(2, "0");
  const iso = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const today = new Date();
  const min = new Date(today);
  min.setDate(min.getDate() + minLeadDays);
  const max = new Date(today);
  max.setDate(max.getDate() + maxDaysAhead);
  const leadHelp = minLeadDays > 0 ? "Primera fecha disponible: " + min.toLocaleDateString("es-UY", {
    day: "numeric",
    month: "long"
  }) + " (" + minLeadDays * 24 + " h de anticipación)." : help;
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    htmlFor: id,
    help: help || leadHelp,
    error: error,
    className: className,
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "fp-selectwrap"
  }, /*#__PURE__*/React.createElement("input", {
    id: id,
    name: name,
    className: "fp-input",
    type: "date",
    value: value || "",
    min: iso(min),
    max: iso(max),
    disabled: disabled,
    onChange: onChange,
    "aria-invalid": error ? true : undefined
  }), /*#__PURE__*/React.createElement("span", {
    className: "fp-selectwrap__caret"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "calendar",
    size: 18
  }))));
}
Object.assign(__ds_scope, { DateField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/DateField.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  id,
  optional,
  help,
  error,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  inputMode,
  name,
  className,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    htmlFor: id,
    optional: optional,
    help: help,
    error: error,
    className: className,
    style: style
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    name: name,
    className: "fp-input",
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    inputMode: inputMode,
    "aria-invalid": error ? true : undefined
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/RadioGroup.jsx
try { (() => {
function RadioGroup({
  label,
  name,
  value,
  onChange,
  options = [],
  help,
  error,
  direction = "column",
  card = true,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    help: help,
    error: error,
    className: className,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: ["fp-radiogroup", direction === "row" && "fp-radiogroup--row"].filter(Boolean).join(" "),
    role: "radiogroup"
  }, options.map(o => /*#__PURE__*/React.createElement("label", {
    key: o.value,
    className: ["fp-check", card && "fp-check--card"].filter(Boolean).join(" "),
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: o.value,
    checked: value === o.value,
    onChange: onChange ? () => onChange(o.value) : undefined,
    disabled: o.disabled
  }), /*#__PURE__*/React.createElement("span", {
    className: "fp-check__box fp-check__box--radio"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fp-check__dot"
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "fp-check__label"
  }, o.label), o.description ? /*#__PURE__*/React.createElement("span", {
    className: "fp-check__desc"
  }, o.description) : null)))));
}
Object.assign(__ds_scope, { RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RadioGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  id,
  optional,
  help,
  error,
  value,
  onChange,
  options = [],
  placeholder,
  disabled,
  name,
  className,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    htmlFor: id,
    optional: optional,
    help: help,
    error: error,
    className: className,
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "fp-selectwrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: id,
    name: name,
    className: "fp-input",
    value: value,
    onChange: onChange,
    disabled: disabled,
    "aria-invalid": error ? true : undefined
  }, rest), placeholder ? /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder) : null, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    className: "fp-selectwrap__caret"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  label,
  id,
  optional,
  help,
  error,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled,
  name,
  className,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    htmlFor: id,
    optional: optional,
    help: help,
    error: error,
    className: className,
    style: style
  }, /*#__PURE__*/React.createElement("textarea", _extends({
    id: id,
    name: name,
    className: "fp-input fp-input--textarea",
    rows: rows,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    "aria-invalid": error ? true : undefined
  }, rest)));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio-publico/App.jsx
try { (() => {
const {
  CartBar
} = window.FTimaPastelerADesignSystem_869e9d || {};
function App() {
  const [items, setItems] = React.useState([]);
  const [open, setOpen] = React.useState(null); // producto en ficha
  const [cart, setCart] = React.useState(false); // hoja de pedido
  const add = (p, extra) => {
    const it = extra || {
      ...p,
      qty: 1,
      variant: p.variants[0].label,
      price: p.variants[0].price,
      note: ""
    };
    setItems(prev => prev.concat([{
      id: p.id,
      name: p.name,
      price: it.price,
      qty: it.qty,
      variant: it.variant,
      note: it.note,
      leadDays: p.leadDays,
      photo: p.photo
    }]));
    setOpen(null);
  };
  const qty = (i, q) => setItems(items.map((x, ix) => ix === i ? {
    ...x,
    qty: q
  } : x));
  const remove = i => setItems(items.filter((_, ix) => ix !== i));
  const note = i => {
    const v = window.prompt("Nota para " + items[i].name, items[i].note || "");
    if (v !== null) setItems(items.map((x, ix) => ix === i ? {
      ...x,
      note: v
    } : x));
  };
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const irACatalogo = () => {
    const el = document.getElementById("catalogo");
    if (el) window.scrollTo({
      top: el.offsetTop - 56,
      behavior: "smooth"
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, {
    count: count,
    onCart: () => setCart(true)
  }), /*#__PURE__*/React.createElement(Hero, {
    onCta: irACatalogo
  }), /*#__PURE__*/React.createElement(Catalogo, {
    onOpen: setOpen,
    onAdd: add
  }), /*#__PURE__*/React.createElement(Pasos, null), /*#__PURE__*/React.createElement(Reviews, null), /*#__PURE__*/React.createElement(Envios, null), /*#__PURE__*/React.createElement(Faq, null), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(CartBar, {
    count: count,
    total: total,
    onCta: () => setCart(true),
    hidden: !!open || cart
  }), open ? /*#__PURE__*/React.createElement(Ficha, {
    product: open,
    onClose: () => setOpen(null),
    onAdd: it => add(open, it)
  }) : null, cart ? /*#__PURE__*/React.createElement(Pedido, {
    items: items,
    onClose: () => setCart(false),
    onQty: qty,
    onRemove: remove,
    onNote: note
  }) : null);
}
const rootEl = document.getElementById("root");
if (rootEl) ReactDOM.createRoot(rootEl).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio-publico/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio-publico/Catalogo.jsx
try { (() => {
const {
  ProductCard,
  Chip,
  SectionHeading
} = window.FTimaPastelerADesignSystem_869e9d || {};
function Catalogo({
  onOpen,
  onAdd
}) {
  const D = window.FP_DATA;
  const [cat, setCat] = React.useState(null);
  const cats = cat ? D.categories.filter(c => c.id === cat) : D.categories;
  return /*#__PURE__*/React.createElement("section", {
    id: "catalogo",
    style: {
      padding: "var(--section-y-mobile) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--gutter-mobile)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Cat\xE1logo",
    title: "Todo se hace por encargo",
    sub: "Arm\xE1 el pedido ac\xE1 y lo cerramos por WhatsApp."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      overflowX: "auto",
      padding: "var(--space-6) var(--gutter-mobile) var(--space-2)"
    }
  }, D.categories.map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c.id,
    icon: c.icon,
    selected: cat === c.id,
    onClick: () => setCat(cat === c.id ? null : c.id)
  }, c.label))), cats.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      padding: "var(--space-7) var(--gutter-mobile) 0"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-h2)",
      margin: "0 0 var(--space-2)"
    }
  }, c.label), /*#__PURE__*/React.createElement("hr", {
    className: "fp-heading__rule",
    style: {
      margin: "0 0 var(--space-5)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)"
    }
  }, D.products.filter(p => p.cat === c.id).map((p, i) => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    name: p.name,
    description: p.short,
    price: p.price,
    unit: p.unit,
    image: "../../assets/fotos/" + p.photo,
    imageAlt: p.alt,
    loading: i < 2 ? "eager" : "lazy",
    flag: p.flag,
    flagTone: p.flagTone || "gold",
    leadLabel: "48 hs de anticipaci\xF3n",
    onOpen: () => onOpen(p),
    onAdd: p.price === null ? undefined : () => onAdd(p)
  }))))));
}
Object.assign(window, {
  Catalogo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio-publico/Catalogo.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio-publico/Ficha.jsx
try { (() => {
const {
  Modal,
  Button,
  Badge,
  QuantityStepper,
  LeadTimeNote,
  Select,
  Textarea,
  PhotoFrame,
  Icon,
  Order
} = window.FTimaPastelerADesignSystem_869e9d || {};

/* Ficha de producto. En el sitio real esta vista existe además como URL
   indexable (/lemon-pie) con Product + Offer en JSON-LD. */
function Ficha({
  product,
  onClose,
  onAdd
}) {
  const [variant, setVariant] = React.useState(0);
  const [note, setNote] = React.useState("");
  const [qty, setQty] = React.useState(1);
  if (!product) return null;
  const D = window.FP_DATA;
  const cat = D.categories.find(c => c.id === product.cat);
  const v = product.variants[variant];
  const sinPrecio = v.price === null;
  return /*#__PURE__*/React.createElement(Modal, {
    open: true,
    eyebrow: cat ? cat.label : "",
    title: product.name,
    onClose: onClose,
    footer: sinPrecio ? /*#__PURE__*/React.createElement(Button, {
      variant: "whatsapp",
      block: true,
      iconLeft: "whatsapp",
      href: "https://wa.me/" + D.whatsapp + "?text=" + encodeURIComponent("Hola Fátima, quiero consultar por " + product.name + ".")
    }, "Consultar por WhatsApp") : /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      block: true,
      iconLeft: "shopping-bag",
      onClick: () => onAdd({
        ...product,
        qty,
        price: v.price,
        variant: v.label,
        note
      })
    }, "Agregar al pedido \xB7 ", Order.formatPrice(v.price * qty))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "0 calc(-1 * var(--space-5)) var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    src: "../../assets/fotos/" + product.photo,
    ratio: "4/3",
    alt: product.alt
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      flexWrap: "wrap",
      marginBottom: "var(--space-4)"
    }
  }, product.flag ? /*#__PURE__*/React.createElement(Badge, {
    tone: product.flagTone || "gold"
  }, product.flag) : null, /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, product.unit)), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      marginBottom: "var(--space-5)"
    }
  }, product.long), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(LeadTimeNote, {
    hours: 48
  }), product.variants.length > 1 ? /*#__PURE__*/React.createElement(Select, {
    id: "variante",
    label: "Tama\xF1o",
    value: String(variant),
    onChange: e => setVariant(Number(e.target.value)),
    options: product.variants.map((x, i) => ({
      value: String(i),
      label: x.label + " — " + Order.formatPrice(x.price)
    }))
  }) : null, /*#__PURE__*/React.createElement(Textarea, {
    id: "nota",
    label: "Nota para este \xEDtem",
    optional: true,
    rows: 2,
    placeholder: "Sin az\xFAcar, dedicatoria: Feliz cumple Ana",
    value: note,
    onChange: e => setNote(e.target.value)
  }), sinPrecio ? null : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-4)",
      paddingTop: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, "Cantidad"), /*#__PURE__*/React.createElement(QuantityStepper, {
    value: qty,
    onChange: setQty,
    max: 10
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      margin: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 16
  }), "Entregas a partir de las 19 h, coordinadas por WhatsApp.")));
}
Object.assign(window, {
  Ficha
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio-publico/Ficha.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio-publico/Layout.jsx
try { (() => {
const {
  Wordmark,
  Logo,
  PhotoFrame,
  Button,
  IconButton,
  SectionHeading,
  Icon,
  Card,
  ReviewCard,
  Accordion,
  Badge,
  LeadTimeNote
} = window.FTimaPastelerADesignSystem_869e9d || {};
const D = window.FP_DATA;
const FOTO = "../../assets/fotos/";
/* El bundle del sistema se recompila entre turnos: si Logo todavía no está
   disponible, se cae al <img> del sello para no romper la página. */
const Sello = Logo || (({
  size,
  src
}) => /*#__PURE__*/React.createElement("img", {
  src: src,
  width: size,
  height: size,
  alt: "F\xE1tima \u2014 Pasteler\xEDa Artesanal",
  style: {
    display: "block",
    width: size,
    height: size,
    borderRadius: "50%"
  }
}));
function Header({
  count,
  onCart
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-3)",
      height: "var(--header-h)",
      padding: "0 var(--gutter-mobile)",
      background: "rgba(251,246,238,.92)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      textDecoration: "none",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement(Sello, {
    size: 38,
    src: "../../assets/brand/logo-sello.png"
  }), /*#__PURE__*/React.createElement(Wordmark, {
    size: 21,
    layout: "stack",
    tagline: ""
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-1)"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "instagram",
    label: "Instagram"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "shopping-bag",
    label: "Ver pedido",
    onClick: onCart
  }), count > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      right: 2,
      minWidth: 18,
      height: 18,
      borderRadius: 999,
      background: "var(--berry-500)",
      color: "var(--cream-50)",
      fontSize: 11,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 5px"
    }
  }, count) : null)));
}
function Hero({
  onCta
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "top"
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    src: FOTO + "carrot-cake-01.jpg",
    ratio: "4/5",
    scrim: "bottom",
    alt: "Corte de carrot cake con capas de bizcochuelo, frosting de queso crema y nuez picada"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fp-heading__eyebrow",
    style: {
      color: "var(--gold-200)"
    }
  }, "Montevideo \xB7 por encargo"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 34,
      lineHeight: 1.08,
      letterSpacing: "-.02em",
      margin: "var(--space-3) 0 var(--space-2)",
      color: "var(--cream-50)"
    }
  }, "Cheesecakes, scones y tortas caseras"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.45,
      color: "var(--cream-100)",
      opacity: .92,
      margin: "0 0 var(--space-5)",
      maxWidth: 300
    }
  }, "El sabor de lo hecho en casa. Retiro en Aguada o env\xEDo en Montevideo, con 48 hs de anticipaci\xF3n."), /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "lg",
    onClick: onCta,
    iconRight: "arrow-right"
  }, "Ver cat\xE1logo")));
}
function Pasos() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y-mobile) var(--gutter-mobile)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "C\xF3mo pedir",
    title: "As\xED de simple",
    sub: "Escribime nom\xE1s, estoy para ayudarte."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      marginTop: "var(--space-6)"
    }
  }, D.pasos.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.n,
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      gap: "var(--space-4)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 34,
      height: 34,
      borderRadius: "var(--radius-circle)",
      border: "1px solid var(--gold-700)",
      color: "var(--brown-900)",
      fontFamily: "var(--font-serif-display)",
      fontSize: 15
    }
  }, p.n.slice(-1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--text-h3)",
      margin: "3px 0 4px"
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      margin: 0
    }
  }, p.text))))));
}
function Reviews() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y-mobile) 0",
      background: "var(--surface-alt)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--gutter-mobile)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Rese\xF1as",
    title: "Lo que llega por mensaje",
    sub: "Textuales de los mensajes de clientas."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-4)",
      overflowX: "auto",
      padding: "var(--space-6) var(--gutter-mobile) var(--space-2)",
      scrollSnapType: "x mandatory"
    }
  }, D.reviews.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: "0 0 264px",
      scrollSnapAlign: "start"
    }
  }, /*#__PURE__*/React.createElement(ReviewCard, {
    text: r.text,
    author: r.author,
    meta: r.meta
  })))));
}
function Envios() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y-mobile) var(--gutter-mobile)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Env\xEDos y retiro",
    title: "Zonas de entrega",
    sub: "Entregas a partir de las 19 h. La hora exacta la coordinamos por WhatsApp."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-2)",
      margin: "var(--space-6) 0 var(--space-5)"
    }
  }, D.zones.map(z => /*#__PURE__*/React.createElement(Badge, {
    key: z.value,
    tone: "outline"
  }, z.label.split(" — ")[0]))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      padding: "var(--space-4) 0",
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "truck",
    size: 18,
    color: "var(--brown-500)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "Env\xEDo a cualquiera de esas zonas"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums"
    }
  }, "$ ", D.envioCosto)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      padding: "var(--space-4) 0",
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "store",
    size: 18,
    color: "var(--brown-500)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "Retiro en Aguada o La Comercial"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontWeight: 600,
      color: "var(--state-ok-fg)"
    }
  }, "Sin costo"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(LeadTimeNote, {
    icon: "map-pin"
  }, "Fuera de esas zonas, escribime y lo vemos.")));
}
function Faq() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y-mobile) var(--gutter-mobile)",
      background: "var(--surface-alt)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Preguntas",
    title: "Antes de encargar"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(Accordion, {
    defaultOpen: 0,
    items: D.faq
  })));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      padding: "var(--space-10) var(--gutter-mobile) var(--space-11)",
      background: "var(--surface-inverse)",
      color: "var(--cream-100)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 30,
    inverse: true
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-serif-display)",
      fontSize: 15,
      color: "var(--gold-200)",
      margin: "var(--space-5) 0 0"
    }
  }, "El sabor de lo hecho en casa."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      margin: "var(--space-7) 0 var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/" + D.whatsapp,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-2)",
      color: "var(--cream-50)",
      textDecoration: "none",
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "whatsapp",
    size: 18
  }), D.whatsappLabel), /*#__PURE__*/React.createElement("a", {
    href: "https://instagram.com/" + D.instagram,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-2)",
      color: "var(--cream-50)",
      textDecoration: "none",
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "instagram",
    size: 18
  }), "@", D.instagram)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--brown-300)",
      lineHeight: 1.6
    }
  }, "Pasteler\xEDa artesanal en Montevideo. Pedidos con 48 hs de anticipaci\xF3n."));
}
Object.assign(window, {
  Sello,
  Header,
  Hero,
  Pasos,
  Reviews,
  Envios,
  Faq,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio-publico/Layout.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio-publico/Pedido.jsx
try { (() => {
const {
  Modal,
  Button,
  CartLine,
  Input,
  Textarea,
  Select,
  RadioGroup,
  DateField,
  Alert,
  Card,
  LeadTimeNote,
  Icon,
  Order
} = window.FTimaPastelerADesignSystem_869e9d || {};

/* Carrito + cierre. No hay servidor: el pedido se cierra armando el link wa.me. */
function Pedido({
  items,
  onClose,
  onQty,
  onRemove,
  onNote
}) {
  const D = window.FP_DATA;
  const [step, setStep] = React.useState("carrito");
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    date: "",
    mode: "retiro",
    address: "",
    zone: "",
    comments: ""
  });
  const set = k => e => setForm({
    ...form,
    [k]: e && e.target ? e.target.value : e
  });
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const zone = D.zones.find(z => z.value === form.zone);
  const shipping = form.mode === "envio" ? zone ? zone.cost : 0 : 0;
  const lead = Order.maxLeadDays(items);
  const order = {
    ...form,
    items,
    shippingCost: shipping,
    zone: zone ? zone.label.split(" — ")[0] : ""
  };
  const ready = form.name && form.phone && form.date && (form.mode === "retiro" || form.address && form.zone);
  if (step === "enviado") {
    return /*#__PURE__*/React.createElement(Modal, {
      open: true,
      title: "Pedido enviado",
      onClose: onClose,
      footer: /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        block: true,
        onClick: onClose
      }, "Volver al cat\xE1logo")
    }, /*#__PURE__*/React.createElement(Alert, {
      tone: "ok",
      title: "Se abri\xF3 WhatsApp con tu pedido"
    }, "Te confirmo disponibilidad y la entrega, a partir de las 19 h."), /*#__PURE__*/React.createElement("p", {
      className: "eyebrow",
      style: {
        margin: "var(--space-6) 0 var(--space-3)"
      }
    }, "Mensaje que se env\xEDa"), /*#__PURE__*/React.createElement(Card, {
      variant: "alt",
      padding: "md"
    }, /*#__PURE__*/React.createElement("pre", {
      style: {
        margin: 0,
        whiteSpace: "pre-wrap",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        lineHeight: 1.6,
        color: "var(--text-secondary)"
      }
    }, Order.buildMessage(order))));
  }
  if (step === "datos") {
    return /*#__PURE__*/React.createElement(Modal, {
      open: true,
      eyebrow: "Paso 2 de 2",
      title: "Tus datos",
      onClose: onClose,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: () => setStep("carrito")
      }, "Volver"), /*#__PURE__*/React.createElement(Button, {
        variant: "whatsapp",
        block: true,
        iconLeft: "whatsapp",
        disabled: !ready,
        onClick: () => {
          window.open(Order.buildLink(order, D.whatsapp), "_blank");
          setStep("enviado");
        }
      }, "Enviar pedido por WhatsApp"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)"
      }
    }, /*#__PURE__*/React.createElement(Input, {
      id: "nombre",
      label: "Nombre",
      placeholder: "Ana Pereira",
      value: form.name,
      onChange: set("name")
    }), /*#__PURE__*/React.createElement(Input, {
      id: "tel",
      label: "Tel\xE9fono",
      type: "tel",
      inputMode: "tel",
      placeholder: "099 123 456",
      value: form.phone,
      onChange: set("phone"),
      help: "Te escribo por WhatsApp para confirmar."
    }), /*#__PURE__*/React.createElement(DateField, {
      value: form.date,
      onChange: set("date"),
      minLeadDays: lead
    }), /*#__PURE__*/React.createElement(RadioGroup, {
      name: "modo",
      label: "\xBFC\xF3mo lo recib\xEDs?",
      direction: "row",
      value: form.mode,
      onChange: v => setForm({
        ...form,
        mode: v
      }),
      options: [{
        value: "retiro",
        label: "Retiro",
        description: "Aguada, sin costo"
      }, {
        value: "envio",
        label: "Envío",
        description: "$ 100"
      }]
    }), form.mode === "envio" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Input, {
      id: "dir",
      label: "Direcci\xF3n",
      placeholder: "Av. Brasil 2680, apto 401",
      value: form.address,
      onChange: set("address")
    }), /*#__PURE__*/React.createElement(Select, {
      id: "zona",
      label: "Zona",
      placeholder: "Eleg\xED tu zona",
      value: form.zone,
      onChange: set("zone"),
      options: D.zones
    })) : /*#__PURE__*/React.createElement(Alert, {
      tone: "info"
    }, "El retiro se coordina en Aguada o La Comercial, a partir de las 19 h."), /*#__PURE__*/React.createElement(Textarea, {
      id: "coment",
      label: "Comentarios",
      optional: true,
      rows: 2,
      placeholder: "Dedicatoria, referencias de la direcci\xF3n",
      value: form.comments,
      onChange: set("comments")
    }), /*#__PURE__*/React.createElement(Totales, {
      subtotal: subtotal,
      shipping: shipping,
      mode: form.mode
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "var(--text-sm)",
        color: "var(--text-muted)",
        margin: 0
      }
    }, "No se cobra nada en el sitio. El pedido se confirma por WhatsApp.")));
  }
  return /*#__PURE__*/React.createElement(Modal, {
    open: true,
    eyebrow: "Paso 1 de 2",
    title: "Tu pedido",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      block: true,
      disabled: !items.length,
      onClick: () => setStep("datos"),
      iconRight: "arrow-right"
    }, "Continuar")
  }, items.length ? /*#__PURE__*/React.createElement(React.Fragment, null, items.map((i, idx) => /*#__PURE__*/React.createElement(CartLine, {
    key: idx,
    name: i.name,
    variant: i.variant,
    note: i.note,
    price: i.price,
    qty: i.qty,
    image: i.photo ? "../../assets/fotos/" + i.photo : undefined,
    imageAlt: i.name,
    onQty: q => onQty(idx, q),
    onRemove: () => onRemove(idx),
    onNote: () => onNote(idx)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-5)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(LeadTimeNote, {
    hours: lead * 24
  }), /*#__PURE__*/React.createElement(Totales, {
    subtotal: subtotal,
    shipping: 0,
    mode: "retiro"
  }))) : /*#__PURE__*/React.createElement("p", {
    className: "prose"
  }, "Todav\xEDa no agregaste nada. Volv\xE9 al cat\xE1logo y eleg\xED lo que quieras."));
}
function Totales({
  subtotal,
  shipping,
  mode
}) {
  const row = {
    display: "flex",
    justifyContent: "space-between",
    gap: "var(--space-4)",
    fontSize: "var(--text-body)",
    color: "var(--text-secondary)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      paddingTop: "var(--space-4)",
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap"
    }
  }, Order.formatPrice(subtotal))), /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("span", null, mode === "envio" ? "Envío" : "Retiro"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap"
    }
  }, Order.formatPrice(shipping))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...row,
      color: "var(--text-body)",
      fontWeight: 600,
      fontSize: "var(--text-body-lg)",
      paddingTop: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap"
    }
  }, Order.formatPrice(subtotal + shipping))));
}
Object.assign(window, {
  Pedido,
  Totales
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio-publico/Pedido.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio-publico/Producto.jsx
try { (() => {
/* Página de producto con URL propia (/lemon-pie). Es la versión indexable de la
   ficha: mismo contenido, sin modal, con JSON-LD Product + Offer. */
function Producto({
  id
}) {
  const {
    IconButton,
    PhotoFrame,
    Badge,
    Button,
    Select,
    Textarea,
    QuantityStepper,
    LeadTimeNote,
    SectionHeading,
    ProductCard,
    Accordion,
    Icon,
    Order
  } = window.FTimaPastelerADesignSystem_869e9d || {};
  const D = window.FP_DATA;
  const p = D.products.find(x => x.id === id) || D.products[0];
  const cat = D.categories.find(c => c.id === p.cat);
  const [variant, setVariant] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const v = p.variants[variant];
  const related = D.products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 2);
  const FOTO = "../../assets/fotos/";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "var(--header-h)",
      padding: "0 var(--gutter-mobile)",
      background: "rgba(251,246,238,.92)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-left",
    label: "Volver al cat\xE1logo"
  }), /*#__PURE__*/React.createElement("a", {
    href: "./index.html",
    style: {
      display: "flex",
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement(Sello, {
    size: 34,
    src: "../../assets/brand/logo-sello.png"
  }))), /*#__PURE__*/React.createElement(IconButton, {
    icon: "shopping-bag",
    label: "Ver pedido"
  })), /*#__PURE__*/React.createElement(PhotoFrame, {
    src: FOTO + p.photo,
    ratio: "1/1",
    alt: p.alt
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-6) var(--gutter-mobile) 0"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      marginBottom: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "./index.html",
    style: {
      color: "var(--text-muted)",
      textDecoration: "none"
    }
  }, "Cat\xE1logo"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: "0 6px"
    }
  }, "/"), /*#__PURE__*/React.createElement("span", null, cat.label)), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--text-h1)",
      lineHeight: 1.1,
      letterSpacing: "-.02em",
      margin: "0 0 var(--space-3)"
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      flexWrap: "wrap",
      marginBottom: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, p.unit), /*#__PURE__*/React.createElement(Badge, {
    tone: "warn",
    icon: "clock"
  }, "48 hs de anticipaci\xF3n"), p.flag ? /*#__PURE__*/React.createElement(Badge, {
    tone: p.flagTone || "gold"
  }, p.flag) : null), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-body-lg)",
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums",
      margin: "0 0 var(--space-5)"
    }
  }, Order.formatPrice(v.price), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: 400,
      color: "var(--text-muted)"
    }
  }, "/ ", v.label.toLowerCase())), /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      marginBottom: "var(--space-6)"
    }
  }, p.long), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, p.variants.length > 1 ? /*#__PURE__*/React.createElement(Select, {
    id: "tam",
    label: "Tama\xF1o",
    value: String(variant),
    onChange: e => setVariant(Number(e.target.value)),
    options: p.variants.map((x, i) => ({
      value: String(i),
      label: x.label + " — " + Order.formatPrice(x.price)
    }))
  }) : null, /*#__PURE__*/React.createElement(Textarea, {
    id: "nota-pdp",
    label: "Nota para este \xEDtem",
    optional: true,
    rows: 2,
    placeholder: "Sin az\xFAcar, dedicatoria: Feliz cumple Ana"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, "Cantidad"), /*#__PURE__*/React.createElement(QuantityStepper, {
    value: qty,
    onChange: setQty,
    max: 10
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    iconLeft: "shopping-bag"
  }, "Agregar al pedido \xB7 ", Order.formatPrice(v.price * qty)), /*#__PURE__*/React.createElement(LeadTimeNote, {
    icon: "truck",
    plain: true
  }, "Retiro en Aguada o env\xEDo a $ 100, a partir de las 19 h."))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y-mobile) var(--gutter-mobile) 0"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Detalle",
    title: "C\xF3mo se pide y c\xF3mo llega",
    rule: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Accordion, {
    items: D.faq.slice(0, 3)
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y-mobile) var(--gutter-mobile) var(--space-11)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: cat.label,
    title: "Del mismo grupo"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)",
      marginTop: "var(--space-6)"
    }
  }, related.map(r => /*#__PURE__*/React.createElement(ProductCard, {
    key: r.id,
    name: r.name,
    description: r.short,
    price: r.price,
    unit: r.unit,
    image: FOTO + r.photo,
    imageAlt: r.alt,
    leadLabel: "48 hs de anticipaci\xF3n"
  })))), /*#__PURE__*/React.createElement(Footer, null));
}
const pdpRoot = document.getElementById("root");
if (pdpRoot) ReactDOM.createRoot(pdpRoot).render(/*#__PURE__*/React.createElement(Producto, {
  id: "lemon-pie"
}));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio-publico/Producto.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio-publico/data.js
try { (() => {
/* Catálogo real de @faticastro001, archivado el 12 de agosto de 2026.
   Precios, zonas, teléfono y textos salen de las publicaciones y de las historias
   destacadas "Pedidos!" y "Envíos". Las descripciones largas están reescritas
   (no se reutiliza la caption literal, por SEO); las citas de reseñas son textuales. */
window.FP_DATA = {
  whatsapp: "59896247822",
  whatsappLabel: "096 247 822",
  instagram: "faticastro001",
  zonaBase: "Aguada y La Comercial, Montevideo",
  entregaDesde: "19 h",
  envioCosto: 100,
  leadDefault: 2,
  // 48 hs de anticipación, igual para todo el catálogo
  categories: [{
    id: "cheesecakes",
    label: "Cheesecakes",
    icon: "cake-slice"
  }, {
    id: "tortas",
    label: "Tortas y tartas",
    icon: "cookie"
  }, {
    id: "galleteria",
    label: "Scones y galletería",
    icon: "croissant"
  }],
  products: [{
    id: "cheesecake-de-dulce-de-leche",
    cat: "cheesecakes",
    name: "Cheesecake de dulce de leche",
    short: "Base crocante, relleno cremoso y una capa generosa de dulce de leche.",
    long: "Base crocante, relleno cremoso y una capa de dulce de leche extendida a mano sobre toda la superficie. Se sirve frío y se corta parejo. Va entero o por porción.",
    price: 1100,
    unit: "entero",
    leadDays: 2,
    flag: "El más pedido",
    variants: [{
      label: "Entero",
      price: 1100
    }, {
      label: "Porción",
      price: 200
    }],
    photo: "cheesecake-dulce-de-leche-01.webp",
    photo2: "cheesecake-dulce-de-leche-02.webp",
    alt: "Cheesecake de dulce de leche entero, con la cobertura extendida en espiral, sobre tabla de madera"
  }, {
    id: "lemon-pie",
    cat: "tortas",
    name: "Lemon pie",
    short: "Base de galletitas, mousse de limón y merengue suizo dorado a soplete.",
    long: "Base de galletitas y mousse de limón intenso, con merengue suizo dorado a soplete. Se hace en cantidad limitada, así que conviene reservar con tiempo.",
    price: 900,
    unit: "entero",
    leadDays: 2,
    flag: "Cantidad limitada",
    flagTone: "berry",
    variants: [{
      label: "Entero",
      price: 900
    }, {
      label: "Porción",
      price: 140
    }],
    photo: "lemon-pie-01.webp",
    photo2: "lemon-pie-02.webp",
    alt: "Lemon pie entero con merengue suizo dorado a soplete sobre plato blanco"
  }, {
    id: "carrot-cake",
    cat: "tortas",
    name: "Carrot cake",
    short: "Zanahoria fresca, especias y frosting de queso crema casero.",
    long: "Zanahoria fresca rallada y especias, con capas de frosting de queso crema hecho en casa y nuez picada en el borde. Sin conservantes ni colorantes.",
    price: 1200,
    unit: "entera",
    leadDays: 2,
    variants: [{
      label: "Entera",
      price: 1200
    }],
    photo: "carrot-cake-01.jpg",
    photo2: "carrot-cake-02.webp",
    alt: "Corte de carrot cake con capas de frosting de queso crema y nuez picada en el borde"
  }, {
    id: "torta-de-frutillas",
    cat: "tortas",
    name: "Torta de frutillas",
    short: "Bizcochuelo esponjoso, crema batida y frutillas frescas.",
    long: "Bizcochuelo esponjoso en capas, crema batida y frutillas frescas cortadas arriba, con hojas de menta. Se arma el mismo día de la entrega.",
    price: 1200,
    unit: "entera",
    leadDays: 2,
    variants: [{
      label: "Entera",
      price: 1200
    }],
    photo: "torta-frutillas-01.webp",
    photo2: "torta-frutillas-02.webp",
    alt: "Torta de frutillas con crema batida, frutillas frescas picadas y hojas de menta"
  }, {
    id: "tiramisu",
    cat: "tortas",
    name: "Tiramisú",
    short: "Con plantillas caseras, hechas una por una.",
    long: "Tiramisú con plantillas hechas en casa, una por una. Se prepara a pedido; el precio depende del tamaño.",
    price: null,
    unit: "a coordinar",
    leadDays: 2,
    variants: [{
      label: "A coordinar",
      price: null
    }],
    photo: "tiramisu-01.jpg",
    alt: "Bandeja de plantillas caseras recién horneadas para tiramisú"
  }, {
    id: "scones-de-queso",
    cat: "galleteria",
    name: "Scones de queso",
    short: "Seis por $100. Para arrancar el día con algo rico.",
    long: "Scones de queso, seis por porción, con la miga abierta y el queso gratinado arriba. Se entregan del día.",
    price: 100,
    unit: "6 unidades",
    leadDays: 2,
    flag: "Para desayunos",
    variants: [{
      label: "6 unidades",
      price: 100
    }],
    photo: "scones-queso-01.webp",
    photo2: "scones-queso-02.webp",
    alt: "Scones de queso apilados en una tabla redonda de madera, con luz de tarde"
  }, {
    id: "cookies-de-chocolate-y-nuez",
    cat: "galleteria",
    name: "Cookies de chocolate y nuez",
    short: "Crujientes por fuera, tiernas por dentro, con una nota de canela.",
    long: "Chocolate, nueces y una nota sutil de canela. Crujientes por fuera y tiernas en el interior. Se hacen por tanda; consultá cantidad y precio.",
    price: null,
    unit: "por tanda",
    leadDays: 2,
    variants: [{
      label: "A coordinar",
      price: null
    }],
    photo: "cookies-01.webp",
    photo2: "cookies-02.jpg",
    alt: "Cookies de chocolate y nuez con trozos de chocolate a la vista"
  }, {
    id: "alfajores-de-maicena",
    cat: "galleteria",
    name: "Alfajores de maicena",
    short: "Tapitas que se deshacen, con dulce de leche generoso. $30 cada uno.",
    long: "Tapas de maicena que se deshacen en la boca, rellenas de dulce de leche y pasadas por coco. Se arman uno por uno.",
    price: 30,
    unit: "cada uno",
    leadDays: 2,
    variants: [{
      label: "Por unidad",
      price: 30
    }],
    photo: "alfajores-01.webp",
    photo2: "alfajores-02.webp",
    alt: "Dos alfajores de maicena rellenos de dulce de leche y bordeados con coco, en plato blanco"
  }, {
    id: "brownies",
    cat: "galleteria",
    name: "Brownies",
    short: "De chocolate, con nuez picada arriba. $130 la porción.",
    long: "Brownies de chocolate, densos, con cobertura y nuez picada arriba. Se venden por porción.",
    price: 130,
    unit: "porción",
    leadDays: 2,
    variants: [{
      label: "Porción",
      price: 130
    }],
    photo: "brownies-01.webp",
    photo2: "brownies-02.webp",
    alt: "Dos porciones de brownie de chocolate con cobertura y nuez picada"
  }],
  /* Envío de precio único: $100 a las zonas publicadas en la historia "Envíos". */
  zones: [{
    value: "comercial",
    label: "La Comercial — $ 100",
    cost: 100
  }, {
    value: "aguada",
    label: "Aguada — $ 100",
    cost: 100
  }, {
    value: "tres-cruces",
    label: "Tres Cruces — $ 100",
    cost: 100
  }, {
    value: "nuevo-centro",
    label: "Nuevo Centro — $ 100",
    cost: 100
  }, {
    value: "av-italia",
    label: "Av. Italia — $ 100",
    cost: 100
  }, {
    value: "parque-batlle",
    label: "Parque Batlle — $ 100",
    cost: 100
  }],
  /* Textuales de la historia destacada "Reseñas ♥️". No se corrigió la ortografía. */
  reviews: [{
    text: "Nada pasaba a decirte que todo estaba muy rico. A las chicas les re gustaron los alfajorcitos.",
    author: "Clienta por DM",
    meta: "Alfajores de maicena"
  }, {
    text: "Volveré a comprar obviamente",
    author: "Clienta por DM",
    meta: "Julio 2026"
  }, {
    text: "muy rica la torta, muchísimas gracias",
    author: "Clienta por DM",
    meta: "Torta de frutillas"
  }],
  /* Pasos textuales de la historia destacada "Pedidos!". */
  pasos: [{
    n: "Paso 1",
    title: "Escribime",
    text: "Por WhatsApp al 096 247 822 o por DM acá en Instagram."
  }, {
    n: "Paso 2",
    title: "Contame tu pedido",
    text: "Qué querés y para cuándo, con 48 hs de anticipación."
  }, {
    n: "Paso 3",
    title: "Coordinamos",
    text: "Te confirmo disponibilidad y la entrega, a partir de las 19 hs."
  }],
  faq: [{
    q: "¿Con cuánta anticipación tengo que pedir?",
    a: "Con 48 hs de anticipación. Contame qué querés y para cuándo, y te confirmo disponibilidad."
  }, {
    q: "¿Hacés envíos?",
    a: "Sí. Llego a La Comercial, Aguada, Tres Cruces, Nuevo Centro, Av. Italia y Parque Batlle. El envío cuesta $ 100. Fuera de esas zonas, escribime y lo vemos."
  }, {
    q: "¿A qué hora entregás?",
    a: "A partir de las 19 hs. La hora exacta la coordinamos por WhatsApp cuando confirmo el pedido."
  }, {
    q: "¿Cómo puedo pagar?",
    a: "A confirmar con Fátima: la cuenta no publica formas de pago."
  }, {
    q: "¿Cómo lo conservo?",
    a: "A confirmar con Fátima: la cuenta no publica indicaciones de conservación."
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio-publico/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.PhotoFrame = __ds_scope.PhotoFrame;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.CartBar = __ds_scope.CartBar;

__ds_ns.CartLine = __ds_scope.CartLine;

__ds_ns.LeadTimeNote = __ds_scope.LeadTimeNote;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.QuantityStepper = __ds_scope.QuantityStepper;

__ds_ns.Order = __ds_scope.Order;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.ReviewCard = __ds_scope.ReviewCard;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.DateField = __ds_scope.DateField;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICONS = __ds_scope.ICONS;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

})();
