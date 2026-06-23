import { useApp, type View } from "@/lib/app-store";
import { cn } from "@/lib/utils";

/** Top navigation that doubles as the 4-flow toggle. */
const NAV: { id: View; label: string; step: string }[] = [
  { id: "auth", label: "Sign In", step: "01" },
  { id: "channels", label: "Channels", step: "02" },
  { id: "tasks", label: "Tasks", step: "03" },
  { id: "billing", label: "Billing", step: "04" },
];

export function TopNav() {
  const { view, setView, isAuthed, isSubscribed } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setView("auth")}
          className="flex items-center gap-2 text-left"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            P
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">PingFlow</div>
            <div className="text-[11px] text-muted-foreground">AI Alert Automation</div>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-secondary p-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                view === item.id
                  ? "bg-background text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="mr-1.5 text-[10px] font-mono text-muted-foreground">
                {item.step}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
              isAuthed
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isAuthed ? "bg-success" : "bg-muted-foreground",
              )}
            />
            {isAuthed ? "Signed in" : "Guest"}
          </span>
          <span
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
              isSubscribed
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            {isSubscribed ? "Pro" : "Free"}
          </span>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex md:hidden overflow-x-auto border-t border-border px-2">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={cn(
              "flex-1 whitespace-nowrap py-3 text-xs font-medium",
              view === item.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
