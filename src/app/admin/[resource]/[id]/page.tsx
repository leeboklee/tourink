import { notFound } from "next/navigation";
import { adminGet, type AdminResource } from "@/lib/admin-crud";
import { ADMIN_NAV, type AdminResourceKey } from "@/lib/admin-config";
import { AdminResourceForm } from "@/components/admin/AdminResourceForm";

export const dynamic = "force-dynamic";

const VALID = new Set(ADMIN_NAV.map((n) => n.key));

export default async function AdminEditPage({
  params
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: raw, id } = await params;
  if (!VALID.has(raw as AdminResourceKey)) notFound();
  const resource = raw as AdminResource;
  const label = ADMIN_NAV.find((n) => n.key === resource)?.label ?? resource;

  if (id === "new") {
    return <AdminResourceForm resource={resource} label={label} item={null} />;
  }

  const item = await adminGet(resource, id);
  if (!item) notFound();

  return (
    <AdminResourceForm
      resource={resource}
      label={label}
      id={id}
      item={item as unknown as Record<string, unknown>}
    />
  );
}
