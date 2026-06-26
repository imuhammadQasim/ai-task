type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

let clerkGetToken: (() => Promise<string | null>) | null = null;

export function setClerkGetToken(fn: () => Promise<string | null>) {
  clerkGetToken = fn;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, token, headers, ...requestOptions } = options;
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  let authToken = token;
  if (!authToken && clerkGetToken) {
    try {
      const jwt = await clerkGetToken();
      if (jwt) authToken = jwt;
    } catch (err) {
      console.error("Failed to retrieve Clerk token for API request:", err);
    }
  }

  const response = await fetch(url, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed. Please try again.");
  }

  return data as T;
}

export const Fetch = {
  get: <T>(path: string, options?: ApiOptions) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>(path, { ...options, method: "DELETE", body }),
};
