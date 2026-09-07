"use client";

import { usePathname } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import type { PublicFeatureFlags } from "@/lib/feature-flags";

/** Public tourist chrome; /admin uses its own layout without tourist nav. */
export function AppChrome({
  children,
  flags
}: {
  children: React.ReactNode;
  flags: PublicFeatureFlags;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col md:max-w-2xl lg:max-w-6xl lg:flex-row lg:gap-8 lg:px-6">
      <SiteNav flags={flags} />
      <main className="flex-1 pb-24 lg:pb-10 lg:pt-8">{children}</main>
    </div>
  );
}
