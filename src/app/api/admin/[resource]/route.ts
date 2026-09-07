import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff";
import { adminList, adminUpsert, type AdminResource } from "@/lib/admin-crud";

const RESOURCES = new Set<AdminResource>([
  "experiences",
  "hotels",
  "routes",
  "nightlife",
  "hangouts",
  "feed",
  "profiles",
  "forum",
  "community"
]);

function parseResource(raw: string): AdminResource | null {
  return RESOURCES.has(raw as AdminResource) ? (raw as AdminResource) : null;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ resource: string }> }
) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { resource: raw } = await ctx.params;
  const resource = parseResource(raw);
  if (!resource) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });

  const items = await adminList(resource);
  return NextResponse.json({ items });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ resource: string }> }
) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { resource: raw } = await ctx.params;
  const resource = parseResource(raw);
  if (!resource) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const item = await adminUpsert(resource, body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Create failed" },
      { status: 400 }
    );
  }
}
