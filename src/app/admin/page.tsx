import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminLogin } from "@/components/admin/login";
import { adminIsConfigured, isAuthenticated, usingDerivedSecret } from "@/lib/auth";
import { blobIsAvailable, readCatalog, storeDriver, storeIsDurable } from "@/lib/store";
import { syncStatus } from "@/lib/sync";

export const metadata: Metadata = {
  title: "Panel de productos",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = adminIsConfigured();

  if (!configured || !(await isAuthenticated())) {
    return <AdminLogin configured={configured} />;
  }

  const { products, settings, proposals, lastSync } = await readCatalog();

  return (
    <AdminDashboard
      products={products}
      settings={settings}
      proposals={proposals ?? []}
      sync={syncStatus()}
      lastSync={lastSync}
      status={{
        driver: storeDriver(),
        durable: storeIsDurable(),
        derivedSecret: usingDerivedSecret(),
        canUploadImages: blobIsAvailable(),
      }}
    />
  );
}
