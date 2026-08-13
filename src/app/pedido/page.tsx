import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Tus datos para el pedido",
  description:
    "Dejá tu nombre, teléfono y fecha de entrega. El sitio arma el mensaje y el pedido se cierra por WhatsApp con Fátima.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/pedido" },
};

export const revalidate = 120;

export default function CheckoutPage() {
  return (
    <div className="wrap flex flex-col gap-8 py-8 pb-28 md:py-14 md:pb-24">
      <div className="flex flex-col gap-4">
        <nav aria-label="Miga de pan" className="text-xs text-brown-500">
          <Link href="/catalogo" className="text-brown-500 no-underline hover:text-brown-900">
            Catálogo
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-brown-900">Datos del pedido</span>
        </nav>
        <h1 className="t-h1">Tus datos</h1>
        <p className="prose-fp text-[16px]">
          Un solo paso. No hace falta crear una cuenta y no se cobra nada en el sitio.
        </p>
      </div>

      <CheckoutForm />
    </div>
  );
}
