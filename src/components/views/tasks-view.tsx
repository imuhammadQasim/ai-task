import { useMemo, useState } from "react";
import { useApp, type ChannelId } from "@/lib/app-store";
import { cn } from "@/lib/utils";

/** Flow 3 — Dynamic task creator + active task grid. */
export function TasksView() {
  const { channels, tasks, addTask, isSubscribed, setView } = useApp();
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<ChannelId[]>(
    channels.filter((c) => c.connected).map((c) => c.id),
  );
  const [showHistory, setShowHistory] = useState(false);

  const activeChannels = useMemo(
    () => channels.filter((c) => c.connected),
    [channels],
  );

  const toggleSel = (id: ChannelId) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || selected.length === 0) return;
    addTask(prompt.trim(), selected);
    setPrompt("");
  };

  const examples = [
    "Alert me when ETH gains 5% in 24h",
    "Mujhe inform karo jab dollar rate 285 se zyada ho jaye",
    "Notify when my GitHub repo gets a new issue",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Upgrade banner */}
      {!isSubscribed && (
        <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 4 12h6v8l8-10h-6V2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                Trial mode — 2 free alerts remaining
              </div>
              <div className="text-xs text-muted-foreground">
                Unlock unlimited monitoring for $1/mo.
              </div>
            </div>
          </div>
          <button
            onClick={() => setView("billing")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Upgrade — $1/mo
          </button>
        </div>
      )}

      {/* Hero composer */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Step 03 — Create Task
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          What should we watch for you?
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Describe your alert in plain English or Roman Urdu. Our AI translates intent
          into a live monitoring rule.
        </p>

        <form onSubmit={submit} className="mt-6">
          <div className="rounded-xl border border-border bg-background focus-within:border-primary focus-within:shadow-[var(--shadow-focus)] transition">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="e.g. Mujhe batao jab gold ka rate 250,000 per tola se neeche jaye…"
              className="w-full resize-none rounded-xl bg-transparent px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2.5">
              <div className="flex flex-wrap gap-1.5">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setPrompt(ex)}
                    className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={!prompt.trim() || selected.length === 0}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create Task →
              </button>
            </div>
          </div>

          {/* Channel pills */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-foreground">
                Deliver alerts to:
              </div>
              {activeChannels.length === 0 && (
                <button
                  type="button"
                  onClick={() => setView("channels")}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  + Connect a channel
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {channels.map((ch) => {
                const isActive = selected.includes(ch.id);
                const disabled = !ch.connected;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleSel(ch.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      disabled &&
                        "cursor-not-allowed border-dashed border-border bg-secondary text-muted-foreground opacity-60",
                      !disabled && isActive &&
                        "border-primary bg-primary text-primary-foreground",
                      !disabled && !isActive &&
                        "border-border bg-card text-foreground hover:bg-secondary",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isActive ? "bg-primary-foreground" : "bg-muted-foreground",
                      )}
                    />
                    {ch.name}
                    {disabled && (
                      <span className="ml-1 rounded bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        not linked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </section>

      {/* Tasks Table */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Active Tasks</h2>
            <p className="text-xs text-muted-foreground">
              Live monitoring across your connected channels.
            </p>
          </div>
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            History Log
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          {/* Desktop table */}
          <table className="hidden w-full md:table">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Task</th>
                <th className="px-5 py-3 font-medium">Channels</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {tasks.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/50">
                  <td className="px-5 py-4 font-medium text-foreground">{t.prompt}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      {t.channels.map((c) => (
                        <span
                          key={c}
                          className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {channels.find((x) => x.id === c)?.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={t.status} />
                  </td>
                  <td className="px-5 py-4 text-right text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-border md:hidden">
            {tasks.map((t) => (
              <div key={t.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{t.prompt}</p>
                  <StatusPill status={t.status} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.channels.map((c) => (
                    <span
                      key={c}
                      className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {channels.find((x) => x.id === c)?.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No tasks yet. Create your first alert above.
            </div>
          )}
        </div>

        {showHistory && (
          <div className="mt-4 rounded-lg border border-border bg-card p-4 text-xs text-muted-foreground shadow-card">
            <div className="mb-2 font-semibold text-foreground">History Log</div>
            <ul className="space-y-1.5 font-mono">
              <li>[12:04:21] Task "BTC drop" → Active Monitoring</li>
              <li>[12:01:08] Task "PSX KSE-100" → Triggered · Email delivered</li>
              <li>[11:58:00] Channel WhatsApp linked</li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "AI Parsing...": "bg-warning/15 text-warning-foreground border-warning/30",
    "Active Monitoring": "bg-primary/10 text-primary border-primary/20",
    Triggered: "bg-success/10 text-success border-success/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        map[status],
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "AI Parsing..." && "bg-warning animate-pulse",
          status === "Active Monitoring" && "bg-primary animate-pulse",
          status === "Triggered" && "bg-success",
        )}
      />
      {status}
    </span>
  );
}
