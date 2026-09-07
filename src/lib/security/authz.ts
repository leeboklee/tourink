import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isStaffRole } from "@/lib/staff";

/** Require a real authenticated session for mutating routes (no demo fallback). */
export async function requireAuthUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return null;
  return {
    id: user.id,
    handle: user.handle,
    name: user.name,
    image: user.image,
    role: user.role,
    authenticated: true as const
  };
}

export async function requireStaffUser() {
  const user = await requireAuthUser();
  if (!user || !isStaffRole(user.role)) return null;
  return user;
}

/**
 * Soft auth: prefer session; demo fallback unless ALLOW_DEMO_MUTATIONS=false.
 * Production should set ALLOW_DEMO_MUTATIONS=false.
 */
export async function requireMutatingActor() {
  const authed = await requireAuthUser();
  if (authed) return authed;

  if (process.env.ALLOW_DEMO_MUTATIONS === "false") {
    return null;
  }

  const { getViewer } = await import("@/lib/viewer");
  const viewer = await getViewer();
  if (!viewer) return null;
  return { ...viewer, role: "USER" };
}
