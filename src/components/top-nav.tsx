import { Link, useRouterState } from "@tanstack/react-router";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { label: "Channels", to: "/channels" },
  { label: "Tasks", to: "/tasks" },
  { label: "Billing", to: "/billing" },
];

export function TopNav() {
  const { isSubscribed } = useApp();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const { user } = useUser();
  const { signOut } = useClerk();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.imageUrl ? (
    <img
      src={user.imageUrl}
      alt={user.fullName || "User"}
      className="h-full w-full rounded-full object-cover"
    />
  ) : user?.firstName && user?.lastName ? (
    `${user.firstName[0]}${user.lastName[0]}`
  ) : (
    user?.fullName
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "U"
  );

  const handleLogout = async () => {
    await signOut({
      redirectUrl: "/login",
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/channels" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
            P
          </div>

          <div>
            <h1 className="text-sm font-semibold">PingFlow</h1>
            <p className="text-xs text-muted-foreground">AI Alert Automation</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border bg-secondary p-1">
          {NAV.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition",
                pathname === item.to
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="mr-2 text-xs">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isSubscribed ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Pro Plan
            </span>
          ) : (
            <button className="rounded-full border px-3 py-1 text-xs hover:bg-secondary">
              Upgrade
            </button>
          )}

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full border border-blue-600 bg-secondary font-semibold transition hover:bg-blue-600 hover:text-white"
            >
              {initials}
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                <div className="border-b border-border p-4">
                  <p className="font-semibold">{user?.fullName || "User"}</p>

                  <p className="text-sm text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H9m4 8H5a2 2 0 01-2-2V6a2 2 0 012-2h8"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex md:hidden overflow-x-auto border-t border-border">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex-1 py-3 text-center text-sm",
              pathname === item.to
                ? "border-b-2 border-primary text-primary"
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
