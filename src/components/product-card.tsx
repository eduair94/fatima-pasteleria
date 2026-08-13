import Image from "next/image";
import Link from "next/link";

import { AddButton } from "@/components/add-button";
import { priceLabel } from "@/lib/product";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 300px, (min-width: 768px) 33vw, 45vw",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  const photo = product.images[0];

  return (
    <article className="fp-prod">
      <Link
        href={`/producto/${product.slug}`}
        className="relative block aspect-4/5 overflow-hidden bg-cream-300 no-underline"
      >
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="fp-prod__img object-cover"
          />
        ) : null}

        {product.badge && product.available ? (
          <span className="fp-badge fp-badge--gold absolute top-3 left-3">{product.badge}</span>
        ) : null}

        {!product.available ? (
          <span className="absolute inset-0 flex items-end bg-brown-900/45 p-3">
            <span className="fp-badge fp-badge--neutral">Esta semana no hay</span>
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="t-h3">
          <Link href={`/producto/${product.slug}`} className="text-brown-900 no-underline">
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-brown-500">{product.leadTimeHours} hs de anticipación</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span
            className={`tnum text-[17px] font-semibold ${
              priceLabel(product) === "Consultar" ? "text-brown-500" : "text-brown-900"
            }`}
          >
            {priceLabel(product)}
          </span>
          <AddButton product={product} />
        </div>
      </div>
    </article>
  );
}
