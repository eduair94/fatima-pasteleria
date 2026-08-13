"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  badge,
}: {
  images: { src: string; alt: string }[];
  badge?: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-4/3 w-full rounded-[26px] bg-cream-300" />;
  }

  const active = images[Math.min(index, images.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/3 overflow-hidden rounded-[26px] bg-cream-300 md:aspect-square">
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="anim-fade object-cover"
        />
        {badge ? <span className="fp-badge fp-badge--gold absolute top-4 left-4">{badge}</span> : null}
      </div>

      {images.length > 1 ? (
        <ul className="m-0 flex list-none gap-3 p-0" role="tablist" aria-label="Fotos del producto">
          {images.map((image, position) => (
            <li key={image.src}>
              <button
                type="button"
                role="tab"
                aria-selected={position === index}
                aria-label={`Foto ${position + 1}: ${image.alt}`}
                onClick={() => setIndex(position)}
                className={`relative h-16 w-16 overflow-hidden rounded-xl border bg-cream-300 transition-colors md:h-20 md:w-20 ${
                  position === index ? "border-berry-500" : "border-line-200 hover:border-brown-300"
                }`}
              >
                <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
