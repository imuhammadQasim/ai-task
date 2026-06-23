import type { AuthSession } from "./auth-service";

const AUTH_SESSION_KEY = "pingflow.auth.session";

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
