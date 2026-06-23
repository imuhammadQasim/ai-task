import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/app-layout";
import { TasksView } from "@/components/views/tasks-view";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

function TasksPage() {
  return (
    <AppLayout>
      <TasksView />
    </AppLayout>
  );
}
