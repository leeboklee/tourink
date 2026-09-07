import { notFound } from "next/navigation";
import { adminList, type AdminResource } from "@/lib/admin-crud";
import { ADMIN_NAV, type AdminResourceKey } from "@/lib/admin-config";
import { AdminResourceList } from "@/components/admin/AdminResourceList";

export const dynamic = "force-dynamic";

const VALID = new Set(ADMIN_NAV.map((n) => n.key));

export default async function AdminResourcePage({
  params
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: raw } = await params;
  if (!VALID.has(raw as AdminResourceKey)) notFound();
  const resource = raw as AdminResource;
  const label = ADMIN_NAV.find((n) => n.key === resource)?.label ?? resource;
  const items = (await adminList(resource)) as Array<Record<string, unknown> & { id: string }>;

  return <AdminResourceList resource={resource} label={label} items={items} />;
}
