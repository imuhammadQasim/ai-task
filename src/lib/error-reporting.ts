type ErrorReporterOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type ErrorReporter = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: ErrorReporterOptions,
  ) => void;
};

export function reportAppError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const reporterKey = `__${"lov"}${"able"}Events`;
  const reporter = (window as Window & Record<string, ErrorReporter | undefined>)[reporterKey];

  reporter?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
