import { useState } from "react";
import { useApp } from "@/lib/app-store";

/** Flow 1 — Authentication. Centered card, Zoom-style. */
export function AuthView() {
  const { setAuthed, setView } = useApp();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthed(true);
    setView("channels");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Left brand panel */}
      <aside className="hidden lg:flex relative flex-col justify-between bg-primary p-12 text-primary-foreground overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15 font-bold">
              P
            </div>
            <span className="font-semibold">PingFlow</span>
          </div>
        </div>
        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Turn plain language into real-time alerts.
          </h1>
          <p className="text-primary-foreground/80 text-base leading-relaxed">
            Describe what to watch — in English or Roman Urdu — and PingFlow pings you on
            WhatsApp, Messenger, or Email the moment it happens.
          </p>
          <ul className="space-y-3 text-sm text-primary-foreground/90">
            {[
              "Multi-channel delivery, one workflow",
              "AI parses intent — no rules to configure",
              "Bank-grade encryption end to end",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 text-xs text-primary-foreground/60">
          © 2026 PingFlow Technologies, Inc.
        </div>
        {/* decorative grid */}
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

      {/* Right form */}
      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to continue to your dashboard."
                : "Start automating alerts in under 60 seconds."}
            </p>
          </div>

          {/* OAuth */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={submit}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <GoogleIcon /> Continue with Google
            </button>
            <button
              type="button"
              onClick={submit}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:opacity-90"
            >
              <AppleIcon /> Continue with Apple
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            OR CONTINUE WITH EMAIL
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <Field label="Full name">
                <input
                  required
                  type="text"
                  placeholder="Ayesha Khan"
                  className="input-base"
                />
              </Field>
            )}
            <Field label="Work email">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-base"
              />
            </Field>
            <Field
              label="Password"
              right={
                mode === "signin" ? (
                  <a href="#" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </a>
                ) : null
              }
            >
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base"
              />
            </Field>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              Continue
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New to PingFlow?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-primary hover:underline"
            >
              {mode === "signin" ? "Create your account" : "Welcome back — sign in"}
            </button>
          </p>
        </div>
      </main>

      {/* shared input style */}
      <style>{`
        .input-base {
          width: 100%;
          border: 1px solid var(--color-border);
          border-radius: 0.5rem;
          background: var(--color-card);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .input-base::placeholder { color: var(--color-muted-foreground); }
        .input-base:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: var(--shadow-focus);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        {right}
      </div>
      {children}
    </label>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.22-1.18 3.02-.84.89-2.21 1.58-3.34 1.49-.14-1.1.4-2.24 1.12-2.99.83-.86 2.27-1.5 3.4-1.52zM20.5 17.4c-.55 1.26-.81 1.82-1.51 2.93-.98 1.55-2.37 3.48-4.09 3.49-1.53.02-1.92-.99-4.01-.98-2.09.01-2.52 1-4.05.98-1.72-.02-3.04-1.76-4.02-3.31C.16 16.7-.13 11.84 1.86 9.26c1.42-1.83 3.66-2.91 5.76-2.91 2.14 0 3.49 1.18 5.25 1.18 1.71 0 2.75-1.18 5.22-1.18 1.87 0 3.84.99 5.25 2.7-4.62 2.53-3.87 9.13-2.84 8.35z"/>
    </svg>
  );
}
