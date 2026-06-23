import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/app-layout";
import { ChannelsView } from "@/components/views/channels-view";

export const Route = createFileRoute("/channels")({
  component: ChannelsPage,
});

function ChannelsPage() {
  return (
    <AppLayout>
      <ChannelsView />
    </AppLayout>
  );
}
