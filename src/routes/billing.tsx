import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/app-layout";
import { BillingView } from "@/components/views/billing-view";

export const Route = createFileRoute("/billing")({
  component: BillingPage,
});

function BillingPage() {
  return (
    <AppLayout>
      <BillingView />
    </AppLayout>
  );
}
