/**
 * Gerçek bir Clerk publishable key var mı?
 * Placeholder `.env.example` değerleri ("pk_test_...") Clerk tarafında reddedilir;
 * local boot sırasında Clerk'siz çalışmak için bu guard kullanılır.
 */
export function hasClerk(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  return (
    (key.startsWith("pk_test_") || key.startsWith("pk_live_")) &&
    key.length > 20 &&
    !key.endsWith("...")
  );
}
