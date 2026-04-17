export const apiVersion = "2024-10-01";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";

export function assertValueOrThrow<T>(
  v: T | undefined,
  errorMessage: string
): T {
  if (v === undefined) throw new Error(errorMessage);
  return v;
}
