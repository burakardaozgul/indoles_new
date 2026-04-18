import { PostHog } from 'posthog-node';

let instance: PostHog | null = null;

export function posthogServer(): PostHog {
  if (!instance) {
    instance = new PostHog(process.env.POSTHOG_API_KEY ?? '', {
      host: process.env.POSTHOG_HOST ?? 'https://eu.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return instance;
}

export async function flushPosthog(): Promise<void> {
  if (instance) await instance.shutdown();
}
