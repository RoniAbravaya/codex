"use client";

import { useEffect } from "react";

const LOGGER_FLAG = "__microcrmFetchLoggerInstalled";

function shouldLog(url: string) {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.pathname.startsWith("/api/");
  } catch {
    return false;
  }
}

export function ApiRequestLogger() {
  useEffect(() => {
    const w = window as Window & { [LOGGER_FLAG]?: boolean; __originalFetch?: typeof fetch };
    if (w[LOGGER_FLAG]) return;

    w[LOGGER_FLAG] = true;
    w.__originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const method = (init?.method || (input instanceof Request ? input.method : "GET") || "GET").toUpperCase();
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      const traceId = `api_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      if (shouldLog(url)) {
        console.groupCollapsed(`🌐 [API] ${method} ${url}`);
        console.log("traceId", traceId);
        console.log("request", { method, url, init });
        console.groupEnd();
      }

      const startedAt = performance.now();
      try {
        const response = await w.__originalFetch!(input, init);
        const durationMs = Math.round(performance.now() - startedAt);

        if (shouldLog(url)) {
          const clone = response.clone();
          let body: unknown = null;
          try {
            const contentType = clone.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
              body = await clone.json();
            } else {
              body = await clone.text();
            }
          } catch {
            body = "<unreadable response body>";
          }

          console.groupCollapsed(
            `${response.ok ? "✅" : "❌"} [API] ${method} ${url} -> ${response.status} (${durationMs}ms)`
          );
          console.log("traceId", traceId);
          console.log("response", {
            status: response.status,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
            body
          });
          console.groupEnd();
        }

        return response;
      } catch (error) {
        const durationMs = Math.round(performance.now() - startedAt);
        if (shouldLog(url)) {
          console.groupCollapsed(`💥 [API] ${method} ${url} -> NETWORK ERROR (${durationMs}ms)`);
          console.log("traceId", traceId);
          console.error(error);
          console.groupEnd();
        }
        throw error;
      }
    };

    return () => {
      if (w.__originalFetch) {
        window.fetch = w.__originalFetch;
      }
      w[LOGGER_FLAG] = false;
    };
  }, []);

  return null;
}
