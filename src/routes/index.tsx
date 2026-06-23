import { createFileRoute } from "@tanstack/react-router";
import { AuthView } from "@/components/views/auth-view";

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
        content: "Multi-channel real-time alerts powered by natural language. Just $1/month.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <AuthView initialStep="login" />;
}
