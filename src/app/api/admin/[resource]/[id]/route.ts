import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff";
import {
  adminDelete,
  adminGet,
  adminToggleActive,
  adminUpsert,
  type AdminResource
} from "@/lib/admin-crud";

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
  ctx: { params: Promise<{ resource: string; id: string }> }
) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { resource: raw, id } = await ctx.params;
  const resource = parseResource(raw);
  if (!resource) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });

  const item = await adminGet(resource, id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ resource: string; id: string }> }
) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { resource: raw, id } = await ctx.params;
  const resource = parseResource(raw);
  if (!resource) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });

  try {
    const body = (await req.json()) as Record<string, unknown>;
    if (typeof body.active === "boolean" && Object.keys(body).length === 1) {
      const item = await adminToggleActive(resource, id, body.active);
      return NextResponse.json({ item });
    }
    const item = await adminUpsert(resource, body, id);
    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ resource: string; id: string }> }
) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { resource: raw, id } = await ctx.params;
  const resource = parseResource(raw);
  if (!resource) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });

  try {
    await adminDelete(resource, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Delete failed" },
      { status: 400 }
    );
  }
}
