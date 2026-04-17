import posthog from "posthog-js";
import type { AnalyticsEvent } from "./events";

export { posthog };

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    opt_out_capturing_by_default: false,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "[data-sensitive]",
    },
  });
  initialized = true;
}

export function track<E extends AnalyticsEvent>(event: E) {
  if (typeof window === "undefined") return;
  posthog.capture(event.name, event.properties as Record<string, unknown>);
}

export function identify(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.identify(userId, traits);
}
