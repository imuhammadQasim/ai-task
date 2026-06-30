import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  taskService,
  type TaskType,
  type MonitorMode,
  type NotificationChannel,
  type CreateTaskPayload,
} from "@/services/task-service";

const MIN_SCHEDULE_MINS = 60;

/** Flow 3 — Explicit task creator (no LLM parsing) + active task grid. */
export function TasksView() {
  const navigate = useNavigate();
  const { tasks, isSubscribed } = useApp();
  const [showHistory, setShowHistory] = useState(false);

  // Form state
  const [taskType, setTaskType] = useState<TaskType>("web_monitor");
  const [monitorMode, setMonitorMode] = useState<MonitorMode>("url");
  const [notificationChannel, setNotificationChannel] = useState<NotificationChannel>("email");
  const [scheduleMins, setScheduleMins] = useState<number>(MIN_SCHEDULE_MINS);
  const [url, setUrl] = useState("");
  const [condition, setCondition] = useState("");
  const [topic, setTopic] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear fields that don't belong to the newly-selected task_type so stale
  // values never leak into the submitted payload.
  const handleTaskTypeChange = (value: TaskType) => {
    setTaskType(value);
    setError(null);
    setSuccess(null);
    // Web-monitor-only fields
    setUrl("");
    setCondition("");
    setTopic("");
    // Date-reminder-only fields
    setReminderDate("");
    setMessage("");
  };

  // Clear the other mode's fields when monitor_mode flips.
  const handleMonitorModeChange = (value: MonitorMode) => {
    setMonitorMode(value);
    setError(null);
    setSuccess(null);
    if (value === "url") {
      setTopic("");
    } else {
      setUrl("");
      setCondition("");
    }
  };

  const buildPayload = (): CreateTaskPayload => {
    if (taskType === "web_monitor") {
      // Mirror the backend's 60-minute floor on the client.
      const mins = scheduleMins < MIN_SCHEDULE_MINS ? MIN_SCHEDULE_MINS : scheduleMins;
      if (monitorMode === "url") {
        return {
          task_type: "web_monitor",
          monitor_mode: "url",
          notification_channel: notificationChannel,
          schedule_mins: mins,
          url: url.trim(),
          condition: condition.trim(),
        };
      }
      return {
        task_type: "web_monitor",
        monitor_mode: "topic",
        notification_channel: notificationChannel,
        schedule_mins: mins,
        topic: topic.trim(),
      };
    }
    // date_reminder
    return {
      task_type: "date_reminder",
      notification_channel: notificationChannel,
      reminder_date: reminderDate,
      message: message.trim(),
    };
  };

  const isValid = useMemo(() => {
    if (taskType === "web_monitor") {
      if (monitorMode === "url") return !!url.trim() && !!condition.trim();
      return !!topic.trim();
    }
    return !!reminderDate && !!message.trim();
  }, [taskType, monitorMode, url, condition, topic, reminderDate, message]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!isValid) return;

    setSubmitting(true);
    try {
      const created = await taskService.createTask(buildPayload());
      setSuccess(`Task #${created.id} created and now ${created.status}.`);
      // Reset mode-specific inputs after a successful create.
      setUrl("");
      setCondition("");
      setTopic("");
      setReminderDate("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task.");
    } finally {
      setSubmitting(false);
    }
  };

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
            onClick={() => navigate({ to: "/billing" })}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Upgrade — $1/mo
          </button>
        </div>
      )}

      {/* Composer */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Step 03 — Create Task
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          What should we watch for you?
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Choose a task type and fill in the details. No guessing — you tell us exactly what to do.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-6">
          {/* Task type selector */}
          <div className="grid gap-2">
            <Label htmlFor="task-type">Task type</Label>
            <Select value={taskType} onValueChange={(v) => handleTaskTypeChange(v as TaskType)}>
              <SelectTrigger id="task-type" className="w-full sm:w-72">
                <SelectValue placeholder="Select a task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web_monitor">Web Monitor</SelectItem>
                <SelectItem value="date_reminder">Date Reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* web_monitor fields */}
          {taskType === "web_monitor" && (
            <div className="space-y-6 rounded-xl border border-border bg-background p-4 sm:p-5">
              {/* monitor_mode selector */}
              <div className="grid gap-2">
                <Label>Monitor mode</Label>
                <RadioGroup
                  value={monitorMode}
                  onValueChange={(v) => handleMonitorModeChange(v as MonitorMode)}
                  className="flex flex-col gap-2 sm:flex-row sm:gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="url" id="mode-url" />
                    <Label htmlFor="mode-url" className="font-normal">
                      Watch a specific URL
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="topic" id="mode-topic" />
                    <Label htmlFor="mode-topic" className="font-normal">
                      Track a topic / question
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {monitorMode === "url" ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="url">URL to monitor</Label>
                    <Input
                      id="url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/pricing"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="condition">Condition (what change to watch for)</Label>
                    <Input
                      id="condition"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      placeholder="e.g. the price drops below $50"
                    />
                  </div>
                </>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="topic">Topic / question</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Is there a new fully-funded 2027 scholarship open?"
                  />
                </div>
              )}

              {/* schedule interval (both modes) */}
              <div className="grid gap-2">
                <Label htmlFor="schedule">Check every (minutes)</Label>
                <Input
                  id="schedule"
                  type="number"
                  min={MIN_SCHEDULE_MINS}
                  value={scheduleMins}
                  onChange={(e) => setScheduleMins(Number(e.target.value))}
                  onBlur={() => {
                    if (scheduleMins < MIN_SCHEDULE_MINS) setScheduleMins(MIN_SCHEDULE_MINS);
                  }}
                  className="w-full sm:w-48"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum {MIN_SCHEDULE_MINS} minutes.
                </p>
              </div>
            </div>
          )}

          {/* date_reminder fields */}
          {taskType === "date_reminder" && (
            <div className="space-y-6 rounded-xl border border-border bg-background p-4 sm:p-5">
              <div className="grid gap-2">
                <Label htmlFor="reminder-date">Reminder date</Label>
                <Input
                  id="reminder-date"
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full sm:w-48"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Submit the scholarship application today"
                />
              </div>
            </div>
          )}

          {/* notification channel (all types) */}
          <div className="grid gap-2">
            <Label htmlFor="channel">Notify via</Label>
            <Select
              value={notificationChannel}
              onValueChange={(v) => setNotificationChannel(v as NotificationChannel)}
            >
              <SelectTrigger id="channel" className="w-full sm:w-72">
                <SelectValue placeholder="Select a channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="messenger">Facebook Messenger</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-success">
              {success}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create Task →"}
            </button>
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
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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
                          {c}
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
                      {c}
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
