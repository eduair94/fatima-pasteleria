"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function ProductGallery({
  images,
  badge,
}: {
  images: { src: string; alt: string }[];
  badge?: string;
}) {
  const [index, setIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  if (images.length === 0) {
    return <div className="aspect-4/3 w-full rounded-[26px] bg-cream-300" />;
  }

  const active = images[Math.min(index, images.length - 1)];

  // El patrón de pestañas se navega con flechas, no con tabulador: el tabulador
  // entra una vez al grupo y las flechas mueven adentro. Sin esto, quien navega
  // con teclado tiene que pasar por cada miniatura para salir de la galería.
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const last = images.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    tabsRef.current[next]?.focus();
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        id="foto-producto"
        role="tabpanel"
        aria-labelledby={`miniatura-${index}`}
        className="relative aspect-4/3 overflow-hidden rounded-[26px] bg-cream-300 md:aspect-square"
      >
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="anim-fade object-cover"
        />
        {badge ? <span className="fp-badge fp-badge--gold absolute top-4 left-4">{badge}</span> : null}
      </div>

      {images.length > 1 ? (
        // Los botones tienen que ser hijos directos del tablist. Antes iban
        // envueltos en <ul>/<li>, y eso invalidaba tanto el tablist como la
        // lista, porque el role del <ul> le sacaba a los <li> su contenedor.
        <div
          role="tablist"
          aria-label="Fotos del producto"
          onKeyDown={onKeyDown}
          className="flex gap-3"
        >
          {images.map((image, position) => (
            <button
              key={image.src}
              ref={(node) => {
                tabsRef.current[position] = node;
              }}
              type="button"
              role="tab"
              id={`miniatura-${position}`}
              aria-selected={position === index}
              aria-controls="foto-producto"
              tabIndex={position === index ? 0 : -1}
              aria-label={`Foto ${position + 1}: ${image.alt}`}
              onClick={() => setIndex(position)}
              className={`relative h-16 w-16 overflow-hidden rounded-xl border bg-cream-300 transition-colors md:h-20 md:w-20 ${
                position === index ? "border-berry-500" : "border-line-200 hover:border-brown-300"
              }`}
            >
              <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
