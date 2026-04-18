import type { VisitorProfilePayload } from '@/lib/schemas/visitor-profile';

export type SubmitResult =
  | { ok: true; calComEmbedUrl?: string }
  | { ok: false; error: string };

export async function submitVisitorProfile(payload: VisitorProfilePayload): Promise<SubmitResult> {
  const res = await fetch('/api/visitor-profile', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: data.error ?? 'unknown' };
  }
  return (await res.json()) as { ok: true; calComEmbedUrl?: string };
}
