/**
 * CORS for browser calls to the API (e.g. signup from the Next.js client).
 * Set FRONTEND_URL to production Vercel URL; optional FRONTEND_URLS=comma,separated.
 * All https://*.vercel.app origins are allowed unless ALLOW_VERCEL_PREVIEWS=false.
 */
export function createCorsOriginHandler() {
  const fromEnv =
    process.env.FRONTEND_URLS?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  const primary = process.env.FRONTEND_URL?.trim() || 'http://localhost:3000';
  const allowList = new Set([
    'http://localhost:3000',
    primary,
    'https://giftcurator-app.vercel.app',
    ...fromEnv,
  ]);

  return (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean | string) => void,
  ) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowList.has(origin)) {
      callback(null, origin);
      return;
    }
    if (process.env.ALLOW_VERCEL_PREVIEWS !== 'false') {
      try {
        const u = new URL(origin);
        if (u.protocol === 'https:' && u.hostname.endsWith('.vercel.app')) {
          callback(null, origin);
          return;
        }
      } catch {
        /* invalid origin */
      }
    }
    callback(new Error('Not allowed by CORS'));
  };
}
