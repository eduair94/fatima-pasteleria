"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** El panel de administración no lleva el header ni el pie del sitio público. */
export function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
