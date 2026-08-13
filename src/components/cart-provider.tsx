"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  getCartServerSnapshot,
  getCartSnapshot,
  readyClient,
  readyServer,
  readySubscribe,
  subscribeToCart,
  writeCart,
} from "@/lib/cart-storage";
import type { CartItem, Product, Settings, Variant } from "@/lib/types";
import { maxLeadTimeHours, subtotal } from "@/lib/whatsapp";

/**
 * El carrito vive sólo en el navegador y persiste entre visitas. No se manda
 * nada al servidor: el pedido se cierra armando un link de WhatsApp.
 */

type CartState = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  leadTimeHours: number;
  settings: Settings;
  add: (product: Product, variant: Variant, quantity?: number, note?: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  setNote: (key: string, note: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartState | null>(null);

function itemKey(productId: string, variantId: string) {
  return `${productId}::${variantId}`;
}

export function CartProvider({
  children,
  settings,
}: {
  children: ReactNode;
  settings: Settings;
}) {
  const items = useSyncExternalStore(subscribeToCart, getCartSnapshot, getCartServerSnapshot);
  const ready = useSyncExternalStore(readySubscribe, readyClient, readyServer);
  const [isOpen, setIsOpen] = useState(false);

  // El panel se cierra con Escape y bloquea el scroll del fondo mientras está abierto.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const add = useCallback(
    (product: Product, variant: Variant, quantity = 1, note?: string) => {
      if (variant.price === null) return;
      const key = itemKey(product.id, variant.id);
      const current = getCartSnapshot();
      const found = current.find((item) => item.key === key);

      writeCart(
        found
          ? current.map((item) =>
              item.key === key
                ? { ...item, quantity: item.quantity + quantity, note: note ?? item.note }
                : item,
            )
          : [
              ...current,
              {
                key,
                productId: product.id,
                slug: product.slug,
                name: product.name,
                variantId: variant.id,
                variantLabel: product.variants.length > 1 ? variant.label : "",
                unitPrice: variant.price,
                quantity,
                note,
                image: product.images[0]?.src,
                leadTimeHours: product.leadTimeHours,
              },
            ],
      );
      setIsOpen(true);
    },
    [],
  );

  const setQuantity = useCallback((key: string, quantity: number) => {
    const current = getCartSnapshot();
    writeCart(
      quantity <= 0
        ? current.filter((item) => item.key !== key)
        : current.map((item) => (item.key === key ? { ...item, quantity } : item)),
    );
  }, []);

  const setNote = useCallback((key: string, note: string) => {
    writeCart(
      getCartSnapshot().map((item) =>
        item.key === key ? { ...item, note: note || undefined } : item,
      ),
    );
  }, []);

  const remove = useCallback((key: string) => {
    writeCart(getCartSnapshot().filter((item) => item.key !== key));
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const value = useMemo<CartState>(
    () => ({
      items,
      ready,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: subtotal(items),
      leadTimeHours: maxLeadTimeHours(items, settings.leadTimeHours),
      settings,
      add,
      setQuantity,
      setNote,
      remove,
      clear,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [items, ready, settings, add, setQuantity, setNote, remove, clear, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart tiene que usarse dentro de <CartProvider>.");
  return context;
}
