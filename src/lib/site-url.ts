const PUBLIC_SITE_CANDIDATES = [
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_DEPLOY_URL,
  process.env.NEXT_PUBLIC_VERCEL_URL
].filter(Boolean) as string[];

function normalizeUrl(url: string) {
  const withProtocol = url.startsWith('http') ? url : `https://${url}`;
  return withProtocol.replace(/\/$/, '');
}

/**
 * Resolve the public site URL, preferring explicit env vars and
 * falling back to the browser origin or a provided origin.
 */
export function getSiteUrl(fallbackOrigin?: string) {
  const envUrl = PUBLIC_SITE_CANDIDATES[0];
  if (envUrl) {
    return normalizeUrl(envUrl);
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return normalizeUrl(window.location.origin);
  }

  if (fallbackOrigin) {
    return normalizeUrl(fallbackOrigin);
  }

  return 'http://localhost:3000';
}

/**
 * Build an absolute URL from a path using the resolved site URL.
 */
export function buildAbsoluteUrl(path: string, baseUrl?: string) {
  const origin = baseUrl ? normalizeUrl(baseUrl) : getSiteUrl();
  const pathname = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${pathname}`;
}
