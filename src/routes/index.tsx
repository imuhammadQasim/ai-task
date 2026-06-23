import { createFileRoute } from "@tanstack/react-router";
import { AppProvider, useApp } from "@/lib/app-store";
import { TopNav } from "@/components/top-nav";
import { AuthView } from "@/components/views/auth-view";
import { ChannelsView } from "@/components/views/channels-view";
import { TasksView } from "@/components/views/tasks-view";
import { BillingView } from "@/components/views/billing-view";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PingFlow — AI Alert Automation" },
      {
        name: "description",
        content:
          "Describe alerts in plain English or Roman Urdu. Get pinged on WhatsApp, Messenger, or Email instantly.",
      },
      { property: "og:title", content: "PingFlow — AI Alert Automation" },
      {
        property: "og:description",
        content:
          "Multi-channel real-time alerts powered by natural language. Just $1/month.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background text-foreground">
        <TopNav />
        <main>
          <CurrentView />
        </main>
      </div>
    </AppProvider>
  );
}

function CurrentView() {
  const { view } = useApp();
  switch (view) {
    case "auth":
      return <AuthView />;
    case "channels":
      return <ChannelsView />;
    case "tasks":
      return <TasksView />;
    case "billing":
      return <BillingView />;
  }
}
