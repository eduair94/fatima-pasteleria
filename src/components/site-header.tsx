"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import { Icon } from "@/components/icon";
import { Wordmark } from "@/components/wordmark";
import { SITE } from "@/lib/site";
import { waConsultLink } from "@/lib/whatsapp";

const NAV = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#como-pedir", label: "Cómo pedir" },
  { href: "/#zonas", label: "Zonas de entrega" },
  { href: "/#preguntas", label: "Preguntas" },
];

export function SiteHeader() {
  const { count, open, settings } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Al cambiar de página el menú se cierra. Se ajusta durante el render, que es
  // lo que recomienda React para derivar estado de un valor que cambió.
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-line-200"
      style={{
        background: "color-mix(in srgb, var(--cream-100) 92%, transparent)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {settings.announcement ? (
        <p className="bg-brown-900 px-5 py-2 text-center text-xs text-cream-50">
          {settings.announcement}
        </p>
      ) : null}

      <div className="wrap flex h-14 items-center justify-between gap-4 md:h-[72px]">
        <button
          type="button"
          className="fp-iconbtn md:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <Icon name={menuOpen ? "x" : "menu"} size={22} />
        </button>

        <div className="md:flex-1">
          <Wordmark size={19} />
        </div>

        <nav aria-label="Principal" className="hidden gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-brown-900 no-underline transition-colors hover:text-berry-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 md:flex-1">
          <a
            href={waConsultLink(settings.whatsappE164)}
            target="_blank"
            rel="noopener noreferrer"
            className="fp-btn fp-btn--ghost fp-btn--sm hidden lg:inline-flex"
          >
            <Icon name="whatsapp" size={16} />
            {settings.whatsappDisplay}
          </a>

          <button
            type="button"
            onClick={open}
            className="fp-iconbtn relative"
            aria-label={count > 0 ? `Ver el pedido, ${count} ítems` : "Ver el pedido"}
          >
            <Icon name="bag" size={22} />
            {count > 0 ? (
              <span
                className="absolute top-1 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-berry-500 px-1 text-[11px] font-semibold text-cream-50"
                aria-hidden="true"
              >
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="menu-mobile"
          aria-label="Principal"
          className="anim-fade border-t border-line-200 bg-cream-50 md:hidden"
        >
          <ul className="wrap flex list-none flex-col gap-0 py-2 pl-5">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-line-200 last:border-b-0">
                <Link
                  href={item.href}
                  className="flex min-h-[52px] items-center justify-between text-brown-900 no-underline"
                >
                  {item.label}
                  <Icon name="chevron-right" size={18} className="text-brown-300" />
                </Link>
              </li>
            ))}
            <li className="pt-4 pb-2">
              <a
                href={waConsultLink(settings.whatsappE164)}
                target="_blank"
                rel="noopener noreferrer"
                className="fp-btn fp-btn--whatsapp fp-btn--block"
              >
                <Icon name="whatsapp" size={18} />
                Escribir al {settings.whatsappDisplay}
              </a>
            </li>
            <li className="pb-4">
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="fp-btn fp-btn--ghost fp-btn--block"
              >
                <Icon name="instagram" size={18} />
                {SITE.instagram.handle}
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
