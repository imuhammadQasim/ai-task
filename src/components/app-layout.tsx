import type { ReactNode } from "react";

import { TopNav } from "@/components/top-nav";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main>{children}</main>
    </div>
  );
}
