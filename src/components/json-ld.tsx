/**
 * Datos estructurados. Se inyectan como JSON-LD en un <script type="application/ld+json">.
 * Nunca se declara nada que la cuenta no publique: no hay aggregateRating ni
 * reviews con puntaje porque no existe ninguna calificación real.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // El contenido lo generamos nosotros a partir del catálogo; se escapa
      // el cierre de etiqueta para no romper el documento.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
