import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApp, type ChannelId } from "@/lib/app-store";
import { cn } from "@/lib/utils";

/** Flow 2 — Channels onboarding. */
export function ChannelsView() {
  const navigate = useNavigate();
  const { channels, toggleChannel } = useApp();
  const [qrOpen, setQrOpen] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const connectedCount = channels.filter((c) => c.connected).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Step 02 — Channels
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Connect your delivery channels
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Link the places where PingFlow should send alerts. You can add or remove channels at any
            time from settings.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-card">
          <div className="text-2xl font-semibold text-foreground">{connectedCount}/3</div>
          <div className="text-xs leading-tight text-muted-foreground">
            Channels
            <br />
            connected
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* WhatsApp */}
        <ChannelCard
          id="whatsapp"
          title="WhatsApp"
          desc="Receive alerts in your WhatsApp chats via secure pairing."
          accent="bg-[#25D366]"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634L3.16 19.0l3.494-1.207z" />
            </svg>
          }
          action={
            channels[0].connected ? (
              <button onClick={() => toggleChannel("whatsapp", false)} className="btn-secondary">
                Disconnect
              </button>
            ) : (
              <button onClick={() => setQrOpen(true)} className="btn-primary">
                Scan QR Code to Link
              </button>
            )
          }
          connected={channels[0].connected}
        />

        {/* Messenger */}
        <ChannelCard
          id="messenger"
          title="Facebook Messenger"
          desc="Get push messages delivered through Messenger in real time."
          accent="bg-[#0084FF]"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.086-2.242c1.09.301 2.246.464 3.445.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259 6.559-6.963 3.131 3.259 5.888-3.259-6.559 6.963z" />
            </svg>
          }
          action={
            channels[1].connected ? (
              <button onClick={() => toggleChannel("messenger", false)} className="btn-secondary">
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => toggleChannel("messenger", true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0084FF] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Connect with Facebook
              </button>
            )
          }
          connected={channels[1].connected}
        />

        {/* Email */}
        <ChannelCard
          id="email"
          title="Email Notification"
          desc="Verified inbox alerts with full incident context attached."
          accent="bg-primary"
          icon={
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          }
          action={
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] text-success-foreground">
                  ✓
                </span>
                <span className="truncate text-sm text-foreground">ayesha@company.com</span>
              </div>
              <button
                onClick={() => {
                  setEmailSent(true);
                  setTimeout(() => setEmailSent(false), 2500);
                }}
                className="btn-secondary"
              >
                {emailSent ? "Test alert sent ✓" : "Send Test Alert"}
              </button>
            </div>
          }
          connected={channels[2].connected}
        />
      </div>

      {/* Continue */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-card sm:flex-row">
        <div>
          <div className="text-sm font-semibold text-foreground">Ready to go?</div>
          <div className="text-xs text-muted-foreground">
            You can always reconfigure channels later from Settings.
          </div>
        </div>
        <button onClick={() => navigate({ to: "/tasks" })} className="btn-primary `!w-auto` px-6">
          Continue to Tasks →
        </button>
      </div>

      {/* QR Modal */}
      {qrOpen && (
        <QRModal
          onClose={() => setQrOpen(false)}
          onConnect={() => {
            toggleChannel("whatsapp", true);
            setQrOpen(false);
          }}
        />
      )}

      <style>{`
        .btn-primary {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          background: var(--color-primary);
          color: var(--color-primary-foreground);
          font-size: .875rem;
          font-weight: 600;
          padding: .625rem 1rem;
          border-radius: .5rem;
          transition: background-color .15s;
        }
        .btn-primary:hover { background: var(--color-primary-hover); }
        .btn-secondary {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--color-secondary);
          color: var(--color-foreground);
          font-size: .875rem;
          font-weight: 500;
          padding: .625rem 1rem;
          border-radius: .5rem;
          border: 1px solid var(--color-border);
          transition: background-color .15s;
        }
        .btn-secondary:hover { background: var(--color-accent); }
      `}</style>
    </div>
  );
}

function ChannelCard({
  title,
  desc,
  icon,
  accent,
  action,
  connected,
}: {
  id: ChannelId;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
  action: React.ReactNode;
  connected: boolean;
}) {
  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex items-start justify-between">
        <div
          className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-white", accent)}
        >
          {icon}
        </div>
        <Badge connected={connected} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      <div className="mt-5 pt-5 border-t border-border">{action}</div>
    </div>
  );
}

function Badge({ connected }: { connected: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        connected ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          connected ? "bg-success animate-pulse" : "bg-muted-foreground",
        )}
      />
      {connected ? "Active Connection" : "Not Connected"}
    </span>
  );
}

function QRModal({ onClose, onConnect }: { onClose: () => void; onConnect: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-elevated">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Link WhatsApp</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Open WhatsApp → Settings → Linked Devices → Scan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Faux QR */}
        <div className="mt-5 flex items-center justify-center rounded-lg border border-border bg-secondary p-6">
          <div
            className="h-48 w-48 rounded-md bg-foreground"
            style={{
              backgroundImage:
                "repeating-conic-gradient(var(--color-background) 0% 25%, var(--color-foreground) 0% 50%)",
              backgroundSize: "16px 16px",
            }}
          />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          QR code expires in 60 seconds
        </p>

        <button
          onClick={onConnect}
          className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          Simulate Scan & Connect
        </button>
      </div>
    </div>
  );
}
