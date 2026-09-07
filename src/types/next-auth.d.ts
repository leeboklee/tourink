import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      handle: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    handle?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    handle?: string;
    role?: string;
  }
}
