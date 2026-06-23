import { Fetch } from "@/helpers/fetch-wrapper";

type AuthPurpose = "signup" | "reset-password";

type AuthSession = {
  accessToken: string;
  user: {
    id?: string;
    name?: string;
    email: string;
  };
};

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type SendOtpPayload = {
  email: string;
  purpose: AuthPurpose;
};

type VerifyOtpPayload = SendOtpPayload & {
  otp: string;
};

type ResetPasswordPayload = VerifyOtpPayload & {
  password: string;
};

const DEMO_OTP = "123456";

async function request<T>(path: string, body?: unknown, method: "POST" | "PATCH" = "POST") {
  if (!import.meta.env.VITE_API_BASE_URL) {
    return demoRequest<T>(path, body);
  }

  return method === "PATCH" ? Fetch.patch<T>(path, body) : Fetch.post<T>(path, body);
}

async function demoRequest<T>(path: string, body: unknown): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 550));

  const payload = (body ?? {}) as {
    name?: string;
    email?: string;
    otp?: string;
  };

  if (path.includes("/otp/verify") && payload.otp !== DEMO_OTP) {
    throw new Error("Invalid OTP. Use 123456 while the backend is not connected.");
  }

  if (path.includes("/login") || path.includes("/otp/verify")) {
    return {
      accessToken: "demo-access-token",
      user: {
        id: "demo-user",
        name: payload.name ?? "Demo User",
        email: payload.email,
      },
    } as T;
  }

  return { ok: true } as T;
}

function normalizeSession(data: unknown, fallbackEmail: string): AuthSession {
  const value = data as {
    accessToken?: string;
    token?: string;
    user?: AuthSession["user"];
    data?: {
      accessToken?: string;
      token?: string;
      user?: AuthSession["user"];
    };
  };

  return {
    accessToken:
      value.accessToken ?? value.token ?? value.data?.accessToken ?? value.data?.token ?? "",
    user: value.user ?? value.data?.user ?? { email: fallbackEmail },
  };
}

export const authService = {
  async signUp(payload: SignUpPayload) {
    return request<{ ok?: boolean }>("/auth/signup", payload);
  },

  async login(payload: LoginPayload) {
    const data = await request<unknown>("/auth/login", payload);

    return normalizeSession(data, payload.email);
  },

  async sendOtp(payload: SendOtpPayload) {
    return request<{ ok?: boolean }>("/auth/otp/send", payload);
  },

  async verifyOtp(payload: VerifyOtpPayload) {
    const data = await request<unknown>("/auth/otp/verify", payload);

    return normalizeSession(data, payload.email);
  },

  async resetPassword(payload: ResetPasswordPayload) {
    return request<{ ok?: boolean }>("/auth/password/reset", payload);
  },

  async loginWithGoogle() {
    if (!import.meta.env.VITE_API_BASE_URL) {
      throw new Error("Google login is ready for backend wiring.");
    }

    return Fetch.get<{ redirectUrl: string }>("/auth/google");
  },
};

export type { AuthPurpose, AuthSession };
