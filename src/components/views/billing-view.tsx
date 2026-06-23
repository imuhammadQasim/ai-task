import { useState } from "react";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

/** Flow 4 — Subscription & payment. */
export function BillingView() {
  const { isSubscribed, setSubscribed, setView } = useApp();
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSubscribed(true);
    }, 1400);
  };

  if (isSubscribed) {
    return <SuccessScreen onContinue={() => setView("tasks")} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Step 04 — Subscription
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Activate your plan
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          One simple price. Cancel anytime.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Plan summary */}
        <aside className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 4 12h6v8l8-10h-6V2z" />
              </svg>
              Most Popular
            </div>
            <h2 className="mt-3 text-xl font-semibold text-foreground">
              Simple Power Plan
            </h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight text-foreground">
                $1.00
              </span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Billed monthly. No setup fees.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-foreground">
              {[
                "Unlimited natural-language alerts",
                "WhatsApp · Messenger · Email delivery",
                "Real-time AI monitoring engine",
                "Full incident history & exports",
                "Priority support, 24-hour response",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="text-muted-foreground">Due today</span>
              <span className="font-semibold text-foreground">$1.00 USD</span>
            </div>
          </div>

          {/* Trust */}
          <div className="mt-4 flex items-center justify-center gap-4 rounded-lg border border-border bg-secondary px-4 py-3 text-xs text-muted-foreground">
            <TrustBadge icon={<LockIcon />} label="SSL Encrypted" />
            <span className="h-3 w-px bg-border" />
            <TrustBadge icon={<StripeMark />} label="Secured by Stripe" />
            <span className="h-3 w-px bg-border" />
            <TrustBadge icon={<ShieldIcon />} label="PCI Compliant" />
          </div>
        </aside>

        {/* Payment form */}
        <section className="lg:col-span-3">
          <form
            onSubmit={submit}
            className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                Payment details
              </h3>
              <div className="flex gap-1.5">
                <CardLogo label="VISA" color="bg-[#1A1F71]" />
                <CardLogo label="MC" color="bg-[#EB001B]" />
                <CardLogo label="AMEX" color="bg-[#006FCF]" />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <FormField label="Cardholder name">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ayesha Khan"
                  className="bill-input"
                />
              </FormField>

              <FormField label="Card number">
                <div className="relative">
                  <input
                    required
                    inputMode="numeric"
                    value={card}
                    onChange={(e) =>
                      setCard(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16)
                          .replace(/(.{4})/g, "$1 ")
                          .trim(),
                      )
                    }
                    placeholder="1234 5678 9012 3456"
                    className="bill-input pr-12 font-mono tracking-wider"
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </div>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Expiry">
                  <input
                    required
                    value={exp}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setExp(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v);
                    }}
                    placeholder="MM / YY"
                    className="bill-input font-mono"
                  />
                </FormField>
                <FormField label="CVC">
                  <input
                    required
                    inputMode="numeric"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    className="bill-input font-mono"
                  />
                </FormField>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary p-3 text-xs text-muted-foreground">
                <LockIcon />
                <span>
                  Your payment is encrypted end-to-end. PingFlow never stores raw card
                  data — processing is handled exclusively by Stripe.
                </span>
              </div>

              <button
                type="submit"
                disabled={processing}
                className={cn(
                  "mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20",
                  processing && "opacity-80",
                )}
              >
                {processing ? (
                  <>
                    <Spinner /> Securing payment…
                  </>
                ) : (
                  <>
                    <LockIcon /> Activate $1/mo Subscription
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-muted-foreground">
                By subscribing you agree to our Terms & Privacy Policy. Cancel anytime in
                Settings.
              </p>
            </div>
          </form>
        </section>
      </div>

      <style>{`
        .bill-input {
          width: 100%;
          border: 1px solid var(--color-border);
          border-radius: .5rem;
          background: var(--color-background);
          padding: .7rem .875rem;
          font-size: .9rem;
          color: var(--color-foreground);
          transition: box-shadow .15s, border-color .15s;
        }
        .bill-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: var(--shadow-focus);
        }
        .bill-input::placeholder { color: var(--color-muted-foreground); }
      `}</style>
    </div>
  );
}

function SuccessScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-foreground">
        You're on the Power Plan
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Subscription activated. Your alerts are now unlimited and your dashboard is fully
        unlocked.
      </p>
      <div className="mt-6 w-full rounded-lg border border-border bg-card p-4 text-left shadow-card">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Plan</span>
          <span className="font-medium text-foreground">Simple Power Plan</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Next charge</span>
          <span className="font-medium text-foreground">$1.00 in 30 days</span>
        </div>
      </div>
      <button
        onClick={onContinue}
        className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
      >
        Go to Dashboard →
      </button>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-foreground">{label}</div>
      {children}
    </label>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-medium">
      {icon}
      {label}
    </span>
  );
}

function CardLogo({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-9 items-center justify-center rounded text-[9px] font-bold text-white",
        color,
      )}
    >
      {label}
    </span>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function StripeMark() {
  return (
    <span className="rounded bg-[#635BFF] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">
      stripe
    </span>
  );
}
function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
