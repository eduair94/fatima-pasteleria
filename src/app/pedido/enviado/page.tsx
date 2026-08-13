import type { Metadata } from "next";

import { OrderConfirmation } from "@/components/order-confirmation";

export const metadata: Metadata = {
  title: "Pedido enviado",
  description: "Tu pedido salió por WhatsApp. Fátima confirma disponibilidad y entrega por ese chat.",
  robots: { index: false, follow: false },
};

export default function OrderSentPage() {
  return <OrderConfirmation />;
}
