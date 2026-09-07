import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CURRENT_USER_HANDLE } from "@/data/mock";

/** Session user, or demo traveler when unauthenticated (local/demo mode). */
export async function getViewer() {
  const session = await auth();
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user) {
      return {
        id: user.id,
        handle: user.handle,
        name: user.name,
        image: user.image,
        authenticated: true as const
      };
    }
  }

  const demo = await prisma.user.findUnique({ where: { handle: CURRENT_USER_HANDLE } });
  if (!demo) return null;
  return {
    id: demo.id,
    handle: demo.handle,
    name: demo.name,
    image: demo.image,
    authenticated: false as const
  };
}
