import { Link, useRouterState } from "@tanstack/react-router";

import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Sign In", step: "01", to: "/login" },
  { label: "Channels", step: "02", to: "/channels" },
  { label: "Tasks", step: "03", to: "/tasks" },
  { label: "Billing", step: "04", to: "/billing" },
];

export function TopNav() {
  const { isAuthed, isSubscribed } = useApp();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/login" className="flex items-center gap-2 text-left">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            P
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">PingFlow</div>
            <div className="text-[11px] text-muted-foreground">AI Alert Automation</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-secondary p-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                pathname === item.to
                  ? "bg-background text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="mr-1.5 text-[10px] font-mono text-muted-foreground">
                {item.step}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isSubscribed ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Pro Plan
            </span>
          ) : (
            <button className="rounded-full border px-3 py-1 text-xs hover:bg-secondary ">
              Upgrade
            </button>
          )}

          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary border-blue-600 border">
            MQ
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex md:hidden overflow-x-auto border-t border-border px-2">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex-1 whitespace-nowrap py-3 text-xs font-medium",
              pathname === item.to
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
