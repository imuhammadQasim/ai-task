import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Check } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <>
      <SignedIn>
        <Navigate to="/channels" replace />
      </SignedIn>
      <SignedOut>
        <div className="grid min-h-[100vh] bg-background lg:grid-cols-[minmax(360px,0.92fr)_minmax(420px,1.08fr)]">
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
            <div className="relative z-10 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15 font-bold">
                P
              </div>
              <span className="font-semibold">PingFlow</span>
            </div>

            <div className="relative z-10 max-w-md space-y-6">
              <div>
                <p className="text-sm font-medium text-primary-foreground/70">AI Alert Automation</p>
                <h1 className="mt-3 text-4xl font-bold leading-tight tracking-normal">
                  Turn plain language into real-time alerts.
                </h1>
              </div>
              <p className="text-base leading-relaxed text-primary-foreground/80">
                Describe what to watch in English or Roman Urdu, then receive alerts on WhatsApp,
                Messenger, or Email the moment it happens.
              </p>
              <ul className="space-y-3 text-sm text-primary-foreground/90">
                {[
                  "Secure authentication powered by Clerk",
                  "Multi-channel delivery from one workflow",
                  "Fast setup for alerts, channels, and billing",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 text-xs text-primary-foreground/60">
              Copyright 2026 PingFlow Technologies, Inc.
            </div>
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </aside>

          <main className="flex items-center justify-center px-4 py-10 sm:px-8">
            <section className="w-full max-w-md flex justify-center">
              <SignIn
                signUpUrl="/signup"
                fallbackRedirectUrl="/channels"
                appearance={{
                  elements: {
                    cardBox: "shadow-none border-0 bg-transparent w-full",
                    card: "shadow-none border-0 bg-transparent w-full",
                    headerTitle: "text-foreground font-semibold text-2xl",
                    headerSubtitle: "text-muted-foreground text-sm",
                    socialButtonsBlockButton: "border border-border text-foreground hover:bg-secondary",
                    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/95 font-semibold",
                    footerActionLink: "text-primary hover:text-primary/90",
                  },
                }}
              />
            </section>
          </main>
        </div>
      </SignedOut>
    </>
  );
}
