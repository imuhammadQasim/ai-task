import { createFileRoute } from "@tanstack/react-router";

import { AuthView } from "@/components/views/auth-view";
import type { AuthPurpose } from "@/services/auth-service";

export const Route = createFileRoute("/verify-otp")({
  validateSearch: (search) => ({
    email: typeof search.email === "string" ? search.email : "",
    purpose:
      search.purpose === "reset-password" || search.purpose === "signup"
        ? (search.purpose as AuthPurpose)
        : "signup",
  }),
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  const search = Route.useSearch();

  return <AuthView initialStep="verify-signup" initialEmail={search.email} />;
}
