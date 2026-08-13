import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Prata } from "next/font/google";

import { CartBar } from "@/components/cart-bar";
import { CartPanel } from "@/components/cart-panel";
import { CartProvider } from "@/components/cart-provider";
import { Chrome } from "@/components/chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE } from "@/lib/site";
import { getSettings } from "@/lib/store";

import "./globals.css";

const prata = Prata({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-prata",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Fátima — Pastelería artesanal en Montevideo | Tortas y cheesecakes por encargo",
    template: "%s | Fátima — Pastelería Artesanal",
  },
  description:
    "Cheesecakes, scones y tortas caseras por encargo en Montevideo. Sin conservantes ni colorantes, con 48 hs de anticipación. Envío a Aguada, La Comercial y alrededores, o retiro sin costo. Pedidos por WhatsApp.",
  keywords: [
    "pastelería artesanal Montevideo",
    "tortas por encargo Montevideo",
    "cheesecake por encargo Montevideo",
    "scones caseros Montevideo",
    "lemon pie Montevideo",
    "carrot cake Montevideo",
    "alfajores de maicena caseros",
    "repostería artesanal Uruguay",
    "torta con envío Montevideo",
  ],
  applicationName: SITE.shortName,
  authors: [{ name: SITE.author.name, url: SITE.author.url }],
  creator: SITE.author.name,
  publisher: SITE.shortName,
  category: "food",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: SITE.url,
    siteName: SITE.name,
    title: "Fátima — Pastelería artesanal en Montevideo",
    description:
      "Cheesecakes, scones y tortas caseras por encargo. Pedí por WhatsApp con 48 hs de anticipación. Envío en Montevideo o retiro sin costo.",
    images: [
      {
        url: "/fotos/02_carrot_cake_01.jpg",
        width: 720,
        height: 960,
        alt: "Corte de carrot cake con capas de bizcocho y frosting de queso crema",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fátima — Pastelería artesanal en Montevideo",
    description:
      "Cheesecakes, scones y tortas caseras por encargo. Pedidos por WhatsApp, con 48 hs de anticipación.",
    images: ["/fotos/02_carrot_cake_01.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [{ url: "/icono.svg", type: "image/svg+xml" }],
    apple: [{ url: "/sello-fatima.jpg" }],
  },
  other: {
    "geo.region": "UY-MO",
    "geo.placename": "Montevideo",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF6EE",
  colorScheme: "light",
};

export const revalidate = 120;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="es-UY" className={`${prata.variable} ${instrument.variable}`}>
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <CartProvider settings={settings}>
          <Chrome>
            <SiteHeader />
          </Chrome>
          <main id="contenido">{children}</main>
          <Chrome>
            <SiteFooter settings={settings} />
          </Chrome>
          <CartBar />
          <CartPanel />
        </CartProvider>
      </body>
    </html>
  );
}
