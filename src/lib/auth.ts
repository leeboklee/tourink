import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const providers: Provider[] = [
  Credentials({
    name: "Demo credentials",
    credentials: {
      handle: { label: "Handle", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      const raw = String(credentials?.handle ?? "")
        .trim()
        .replace(/^@/, "")
        .toLowerCase();
      const password = String(credentials?.password ?? "");
      if (!raw || !password) return null;

      const user = await prisma.user.findFirst({
        where: { OR: [{ handle: raw }, { email: raw }] }
      });
      if (!user?.passwordHash) return null;
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email ?? undefined,
        image: user.image ?? undefined,
        handle: user.handle,
        role: user.role
      };
    }
  })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  );
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id?: string; handle?: string; role?: string };
        token.sub = u.id ?? token.sub;
        if (u.handle) token.handle = u.handle;
        if (u.role) token.role = u.role;
      }
      if (token.sub && (!token.handle || !token.role)) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        if (dbUser) {
          token.handle = dbUser.handle;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.handle = (token.handle as string) ?? "";
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "tourink-dev-secret-change-me",
  trustHost: true
});
