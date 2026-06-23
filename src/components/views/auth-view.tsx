import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Apple,
  Check,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useApp } from "@/lib/app-store";
import { authService, type AuthPurpose, type AuthSession } from "@/services/auth-service";
import { saveAuthSession } from "@/services/auth-session";

type AuthStep = "login" | "signup" | "verify-signup" | "forgot-password" | "reset-password";

type AuthForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
};

const initialForm: AuthForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  otp: "",
};

const stepCopy: Record<AuthStep, { title: string; description: string; button: string }> = {
  login: {
    title: "Welcome back",
    description: "Sign in to continue to your dashboard.",
    button: "Sign in",
  },
  signup: {
    title: "Create your account",
    description: "Start automating alerts in under 60 seconds.",
    button: "Create account",
  },
  "verify-signup": {
    title: "Verify your email",
    description: "Enter the 6-digit code sent to your work email.",
    button: "Verify and continue",
  },
  "forgot-password": {
    title: "Reset your password",
    description: "Enter your email and we will send you a verification code.",
    button: "Send reset code",
  },
  "reset-password": {
    title: "Set a new password",
    description: "Verify the code and choose a new password.",
    button: "Update password",
  },
};

export function AuthView({
  initialStep = "login",
  initialEmail = "",
}: {
  initialStep?: AuthStep;
  initialEmail?: string;
}) {
  const navigate = useNavigate();
  const { setAuthed } = useApp();
  const [form, setForm] = useState<AuthForm>({
    ...initialForm,
    email: initialEmail,
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const step = initialStep;
  const copy = stepCopy[initialStep];
  const isOtpStep = initialStep === "verify-signup" || initialStep === "reset-password";
  const authPurpose: AuthPurpose = initialStep === "verify-signup" ? "signup" : "reset-password";

  const passwordHint = useMemo(() => {
    if (!form.password) return "";
    if (form.password.length < 8) return "Use at least 8 characters.";
    return "Password strength looks good.";
  }, [form.password]);

  const updateField = (field: keyof AuthForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  };

  const completeAuth = (session: AuthSession) => {
    saveAuthSession(session);
    setAuthed(true);
    navigate({ to: "/channels" });
  };

  const validatePassword = () => {
    if (form.password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    if (
      (initialStep === "signup" || initialStep === "reset-password") &&
      form.password !== form.confirmPassword
    ) {
      throw new Error("Passwords do not match.");
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    try {
      const email = form.email.trim().toLowerCase();

      if (initialStep === "login") {
        validatePassword();
        const session = await authService.login({ email, password: form.password });
        completeAuth(session);
        return;
      }

      if (initialStep === "signup") {
        if (!form.name.trim()) throw new Error("Full name is required.");
        validatePassword();
        await authService.signUp({ name: form.name.trim(), email, password: form.password });
        await authService.sendOtp({ email, purpose: "signup" });
        navigate({ to: "/verify-otp", search: { email, purpose: "signup" } });
        return;
      }

      if (initialStep === "verify-signup") {
        if (form.otp.length !== 6) throw new Error("Enter the 6-digit verification code.");
        const session = await authService.verifyOtp({ email, otp: form.otp, purpose: "signup" });
        completeAuth(session);
        return;
      }

      if (initialStep === "forgot-password") {
        await authService.sendOtp({ email, purpose: "reset-password" });
        navigate({ to: "/reset-password", search: { email } });
        return;
      }

      if (initialStep === "reset-password") {
        if (form.otp.length !== 6) throw new Error("Enter the 6-digit reset code.");
        validatePassword();
        await authService.resetPassword({
          email,
          otp: form.otp,
          password: form.password,
          purpose: "reset-password",
        });
        setForm((current) => ({ ...current, password: "", confirmPassword: "", otp: "" }));
        navigate({ to: "/login", search: { email, status: "password-updated" } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const resendOtp = async () => {
    setPending(true);
    setError("");
    setSuccess("");

    try {
      await authService.sendOtp({ email: form.email.trim().toLowerCase(), purpose: authPurpose });
      setSuccess("A new code has been sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend the code.");
    } finally {
      setPending(false);
    }
  };

  const startGoogleLogin = async () => {
    setPending(true);
    setError("");
    setSuccess("");

    try {
      const { redirectUrl } = await authService.loginWithGoogle();
      window.location.assign(redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login is not connected yet.");
    } finally {
      setPending(false);
    }
  };

  return (
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
              "Secure email verification before account access",
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
        <section className="w-full max-w-md">
          {initialStep !== "login" && initialStep !== "signup" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              asChild
              className="mb-5 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <Link
                to={initialStep === "reset-password" ? "/forgot-password" : "/signup"}
                search={initialStep === "reset-password" && form.email ? { email: form.email } : {}}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          )}

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary">
              {isOtpStep ? <ShieldCheck className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
            </div>
            <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
              {copy.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{copy.description}</p>
          </div>

          {(initialStep === "login" || initialStep === "signup") && (
            <>
              <div className="grid gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={startGoogleLogin}
                  disabled={pending}
                  className="h-11 w-full"
                >
                  <GoogleIcon />
                  Continue with Google
                </Button>
                {/* <Button
                  type="button"
                  variant="outline"
                  disabled
                  className="h-11 w-full text-muted-foreground"
                >
                  <Apple className="h-4 w-4" />
                  Continue with Apple
                </Button> */}
              </div>

              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                OR CONTINUE WITH EMAIL
                <div className="h-px flex-1 bg-border" />
              </div>
            </>
          )}

          <form onSubmit={submit} className="space-y-4">
            {initialStep === "signup" && (
              <Field label="Full name" icon={<User className="h-4 w-4" />}>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Ayesha Khan"
                  className="input-base pl-10"
                  autoComplete="name"
                />
              </Field>
            )}

            <Field label="Work email" icon={<Mail className="h-4 w-4" />}>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="you@company.com"
                className="input-base"
                autoComplete="email"
                disabled={step === "verify-signup" || step === "reset-password"}
              />
            </Field>

            {(step === "login" || step === "signup" || step === "reset-password") && (
              <Field
                label={step === "reset-password" ? "New password" : "Password"}
                icon={<Lock className="h-4 w-4" />}
                right={
                  initialStep === "login" ? (
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  ) : null
                }
              >
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Minimum 8 characters"
                  className="input-base pl-10"
                  autoComplete={initialStep === "login" ? "current-password" : "new-password"}
                />
              </Field>
            )}

            {(step === "signup" || step === "reset-password") && (
              <Field label="Confirm password" icon={<Lock className="h-4 w-4" />}>
                <input
                  required
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => updateField("confirmPassword", event.target.value)}
                  placeholder="Repeat password"
                  className="input-base pl-10"
                  autoComplete="new-password"
                />
              </Field>
            )}

            {passwordHint && step !== "login" && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                {passwordHint}
              </p>
            )}

            {isOtpStep && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Verification code</span>
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={pending}
                    className="text-xs font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-50"
                  >
                    Resend code
                  </button>
                </div>
                <InputOTP
                  maxLength={6}
                  value={form.otp}
                  onChange={(value) => updateField("otp", value)}
                  containerClassName="justify-between"
                >
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-12 w-11 rounded-md border bg-card text-base shadow-none first:rounded-md last:rounded-md"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            )}

            {error && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md border border-success/20 bg-success/10 px-3 py-2 text-sm text-success">
                {success}
              </div>
            )}

            <Button type="submit" disabled={pending} className="h-11 w-full font-semibold">
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {copy.button}
            </Button>
          </form>

          {(initialStep === "login" || initialStep === "signup") && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {initialStep === "login" ? "New to PingFlow?" : "Already have an account?"}{" "}
              <Link
                to={initialStep === "login" ? "/signup" : "/login"}
                className="font-medium text-primary hover:underline"
              >
                {initialStep === "login" ? "Create your account" : "Sign in"}
              </Link>
            </p>
          )}
        </section>
      </main>

      <style>{`
        .input-base {
          width: 100%;
          border: 1px solid var(--color-border);
          border-radius: 0.5rem;
          background: var(--color-card);
          padding: 0.625rem 2.5rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          transition: box-shadow 0.15s, border-color 0.15s;
        }

        .input-base::placeholder {
          color: var(--color-muted-foreground);
        }

        .input-base:disabled {
          cursor: not-allowed;
          background: var(--color-secondary);
          color: var(--color-muted-foreground);
        }

        .input-base:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: var(--shadow-focus);
        }
      `}</style>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function Field({
  label,
  right,
  icon,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        {right}
      </div>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        {children}
      </div>
    </label>
  );
}
