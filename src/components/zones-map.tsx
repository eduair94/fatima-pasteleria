/**
 * Esquema de las zonas de entrega. No es un mapa a escala ni pretende serlo:
 * es un diagrama de posición relativa, dibujado con el mismo trazo fino y la
 * misma paleta que el resto del sistema. Las seis zonas son las que la cuenta
 * publica en la historia destacada "Envíos".
 */

const ZONE_POINTS = [
  { name: "Aguada", x: 118, y: 118, base: true },
  { name: "La Comercial", x: 196, y: 96, base: true },
  { name: "Nuevo Centro", x: 168, y: 168 },
  { name: "Tres Cruces", x: 268, y: 150 },
  { name: "Parque Batlle", x: 352, y: 122 },
  { name: "Av. Italia", x: 424, y: 168 },
];

export function ZonesMap() {
  return (
    <figure className="m-0 overflow-hidden rounded-[26px] border border-line-200 bg-cream-50">
      <svg
        viewBox="0 0 500 300"
        className="h-auto w-full"
        role="img"
        aria-labelledby="titulo-zonas descripcion-zonas"
      >
        <title id="titulo-zonas">Esquema de las zonas de entrega en Montevideo</title>
        <desc id="descripcion-zonas">
          Diagrama de posición relativa, de oeste a este: Aguada, La Comercial, Nuevo Centro, Tres
          Cruces, Parque Batlle y Av. Italia. Al sur, el Río de la Plata. Retiro sin costo en Aguada
          y La Comercial.
        </desc>

        <rect width="500" height="300" fill="var(--cream-50)" />

        {/* Trama de calles: sólo sugerida, muy tenue. */}
        <g stroke="var(--line-200)" strokeWidth="1" opacity="0.9">
          {[40, 80, 120, 160, 200].map((y) => (
            <line key={`h${y}`} x1="24" y1={y} x2="476" y2={y} />
          ))}
          {[70, 140, 210, 280, 350, 420].map((x) => (
            <line key={`v${x}`} x1={x} y1="24" x2={x} y2="228" />
          ))}
        </g>

        {/* Rambla y río al sur. */}
        <path
          d="M8 244 C 110 226, 210 252, 300 236 S 440 244, 492 230"
          fill="none"
          stroke="var(--gold-600)"
          strokeWidth="1.5"
          opacity="0.75"
        />
        <path
          d="M8 244 C 110 226, 210 252, 300 236 S 440 244, 492 230 L 492 300 L 8 300 Z"
          fill="var(--cream-200)"
        />
        <text
          x="250"
          y="278"
          textAnchor="middle"
          fill="var(--brown-500)"
          fontSize="11"
          fontFamily="var(--font-sans)"
          letterSpacing="0.14em"
        >
          RÍO DE LA PLATA
        </text>

        {/* Zonas. Las dos de retiro llevan anillo dorado. */}
        {ZONE_POINTS.map((zone) => (
          <g key={zone.name}>
            {zone.base ? (
              <circle
                cx={zone.x}
                cy={zone.y}
                r="13"
                fill="none"
                stroke="var(--gold-600)"
                strokeWidth="1.25"
                opacity="0.8"
              />
            ) : null}
            <circle cx={zone.x} cy={zone.y} r="6" fill="var(--berry-500)" />
            <text
              x={zone.x}
              y={zone.y - 20}
              textAnchor="middle"
              fill="var(--brown-900)"
              fontSize="13"
              fontFamily="var(--font-sans)"
              fontWeight="500"
            >
              {zone.name}
            </text>
          </g>
        ))}
      </svg>

      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line-200 px-5 py-4 text-sm text-brown-500">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-berry-500" aria-hidden="true" />
          Envío
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block h-3.5 w-3.5 rounded-full border border-gold-700"
            aria-hidden="true"
          />
          Retiro sin costo
        </span>
        <span className="ml-auto">Esquema de posición, no está a escala.</span>
      </figcaption>
    </figure>
  );
}
