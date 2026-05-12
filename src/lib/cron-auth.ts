/**
 * Shared helper to verify CRON_SECRET for protected API routes.
 * Checks both Authorization: Bearer <secret> and x-cron-secret: <secret> headers.
 */
export function checkCronAuth(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.warn("[cron-auth] CRON_SECRET environment variable is not set");
    return false;
  }

  // Check Authorization: Bearer <secret>
  const auth = request.headers.get("authorization");
  if (auth) {
    const token = auth.replace(/^Bearer\s+/i, "").trim();
    if (token === secret) return true;
  }

  // Check x-cron-secret: <secret>
  const xs = request.headers.get("x-cron-secret");
  if (xs === secret) return true;

  return false;
}
