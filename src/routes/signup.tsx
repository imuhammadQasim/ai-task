import { createFileRoute } from "@tanstack/react-router";

import { AuthView } from "@/components/views/auth-view";

export const Route = createFileRoute("/signup")({
  component: () => <AuthView initialStep="signup" />,
});
