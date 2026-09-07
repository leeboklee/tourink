import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export function isStaffRole(role: string | null | undefined): boolean {
  return role === "ADMIN" || role === "STAFF";
}

/** Session user must be ADMIN or STAFF. Returns DB user or null. */
export async function requireStaff() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !isStaffRole(user.role)) return null;
  return user;
}

export function newCatalogId(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
