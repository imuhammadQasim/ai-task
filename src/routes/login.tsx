import { createFileRoute } from "@tanstack/react-router";

import { AuthView } from "@/components/views/auth-view";

export const Route = createFileRoute("/login")({
  validateSearch: (search) => ({
    email: typeof search.email === "string" ? search.email : "",
    status: typeof search.status === "string" ? search.status : "",
  }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();

  return <AuthView initialStep="login" initialEmail={search.email} />;
}
