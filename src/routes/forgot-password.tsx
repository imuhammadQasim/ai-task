import { createFileRoute } from "@tanstack/react-router";

import { AuthView } from "@/components/views/auth-view";

export const Route = createFileRoute("/forgot-password")({
  validateSearch: (search) => ({
    email: typeof search.email === "string" ? search.email : "",
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const search = Route.useSearch();

  return <AuthView initialStep="forgot-password" initialEmail={search.email} />;
}
