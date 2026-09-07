import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/staff";
import { ADMIN_NAV } from "@/lib/admin-config";
import { AdminSignOut } from "@/components/admin/AdminSignOut";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false }
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  if (!staff) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-ink-950 text-paper">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row lg:gap-8 lg:px-6">
        <aside className="border-b border-white/10 px-4 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-56 lg:border-b-0 lg:border-r lg:py-8">
          <Link href="/admin" className="font-display text-2xl tracking-tight">
            Tourink Admin
          </Link>
          <p className="mt-1 text-xs text-white/45">
            {staff.role} · @{staff.handle}
          </p>
          <nav className="mt-6 flex flex-wrap gap-1 lg:flex-col lg:space-y-1 lg:gap-0">
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-paper"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/reports"
              className="rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-neon-cyan"
            >
              Result reports
            </Link>
            <Link
              href="/admin/reports/korea-apis"
              className="rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-neon-cyan"
            >
              Korea APIs
            </Link>
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-neon-cyan"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 space-y-2 text-xs text-white/45">
            <Link href="/experiences" className="block text-neon-cyan hover:underline">
              ← Public site
            </Link>
            <AdminSignOut />
          </div>
        </aside>
        <main className="flex-1 px-4 py-6 lg:px-0 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
