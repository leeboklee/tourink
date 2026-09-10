import type { ReactNode } from "react";
import { clsx } from "clsx";

export function PageShell({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("px-4 pb-8 pt-4 lg:px-0", className)}>{children}</div>;
}
