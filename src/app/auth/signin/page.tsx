import { Suspense } from "react";
import SignInClient from "./SignInClient";

export const metadata = { title: "Sign in" };

export default function Page() {
  return (
    <Suspense fallback={<p className="px-4 pt-8 text-sm text-white/45">Loading…</p>}>
      <SignInClient />
    </Suspense>
  );
}
