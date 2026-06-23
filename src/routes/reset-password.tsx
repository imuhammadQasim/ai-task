import { createFileRoute } from "@tanstack/react-router";

import { AuthView } from "@/components/views/auth-view";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search) => ({
    email: typeof search.email === "string" ? search.email : "",
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const search = Route.useSearch();

  return <AuthView initialStep="reset-password" initialEmail={search.email} />;
}
