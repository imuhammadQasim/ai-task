import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Global mock app state shared across the 4 flows.
 * Uses plain useState (per spec) instead of a heavy state manager.
 */

export type ChannelId = "whatsapp" | "messenger" | "email";

export type Channel = {
  id: ChannelId;
  name: string;
  connected: boolean;
};

export type Task = {
  id: string;
  prompt: string;
  channels: ChannelId[];
  status: "AI Parsing..." | "Active Monitoring" | "Triggered";
  createdAt: string;
};

export type View = "auth" | "channels" | "tasks" | "billing";

type AppState = {
  view: View;
  setView: (v: View) => void;

  isAuthed: boolean;
  setAuthed: (v: boolean) => void;

  isSubscribed: boolean;
  setSubscribed: (v: boolean) => void;

  channels: Channel[];
  toggleChannel: (id: ChannelId, value?: boolean) => void;

  tasks: Task[];
  addTask: (prompt: string, channels: ChannelId[]) => void;
};

const AppCtx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("auth");
  const [isAuthed, setAuthed] = useState(false);
  const [isSubscribed, setSubscribed] = useState(false);

  const [channels, setChannels] = useState<Channel[]>([
    { id: "whatsapp", name: "WhatsApp", connected: false },
    { id: "messenger", name: "Facebook Messenger", connected: false },
    { id: "email", name: "Email Notification", connected: true },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      prompt: "Alert me if BTC drops below $60,000",
      channels: ["email"],
      status: "Active Monitoring",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t2",
      prompt: "Mujhe batao jab PSX KSE-100 1% se zyada gire",
      channels: ["email"],
      status: "Triggered",
      createdAt: new Date().toISOString(),
    },
  ]);

  const toggleChannel = (id: ChannelId, value?: boolean) =>
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, connected: value ?? !c.connected } : c)),
    );

  const addTask = (prompt: string, ch: ChannelId[]) => {
    const id = `t${Date.now()}`;
    setTasks((prev) => [
      { id, prompt, channels: ch, status: "AI Parsing...", createdAt: new Date().toISOString() },
      ...prev,
    ]);
    // Simulate AI lifecycle
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "Active Monitoring" } : t)),
      );
    }, 1800);
  };

  return (
    <AppCtx.Provider
      value={{
        view,
        setView,
        isAuthed,
        setAuthed,
        isSubscribed,
        setSubscribed,
        channels,
        toggleChannel,
        tasks,
        addTask,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
