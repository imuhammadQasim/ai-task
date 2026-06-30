import { Fetch } from "@/helpers/fetch-wrapper";

export type TaskType = "web_monitor" | "date_reminder";
export type MonitorMode = "url" | "topic";
export type NotificationChannel = "email" | "messenger";

// Mirrors the backend TaskCreate schema in app/routers/tasks.py exactly.
export type CreateTaskPayload = {
  task_type: TaskType;
  notification_channel: NotificationChannel;
  schedule_mins?: number | null;
  monitor_mode?: MonitorMode | null;
  url?: string | null;
  condition?: string | null;
  topic?: string | null;
  reminder_date?: string | null; // ISO date (YYYY-MM-DD)
  message?: string | null;
};

export type TaskResponse = {
  id: number;
  user_id: string;
  task_type: TaskType;
  config: Record<string, unknown>;
  schedule_mins: number | null;
  status: string;
  next_run: string | null;
  created_at: string | null;
};

export const taskService = {
  async createTask(payload: CreateTaskPayload) {
    return Fetch.post<TaskResponse>("/api/tasks", payload);
  },

  async listTasks() {
    return Fetch.get<TaskResponse[]>("/api/tasks");
  },
};
