"use client";

import { signOut } from "next-auth/react";

export function AdminSignOut() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
      className="text-white/55 hover:text-neon-pink"
    >
      Sign out
    </button>
  );
}
