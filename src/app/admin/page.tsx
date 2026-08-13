import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminLogin } from "@/components/admin/login";
import { isAuthenticated, usingDefaultPassword } from "@/lib/auth";
import { readCatalog, storeDriver, storeIsDurable } from "@/lib/store";

export const metadata: Metadata = {
  title: "Panel de productos",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) return <AdminLogin />;

  const { products, settings } = await readCatalog();

  return (
    <AdminDashboard
      products={products}
      settings={settings}
      status={{
        driver: storeDriver(),
        durable: storeIsDurable(),
        defaultPassword: usingDefaultPassword(),
      }}
    />
  );
}
