// On Vercel, the real client IP arrives in x-forwarded-for (may contain a
// comma-separated chain if there were multiple proxies — the first entry is
// the original client). req.socket.remoteAddress is the fallback for local
// dev / other hosts. IPs are best-effort identifiers, not guaranteed unique
// per person (shared wifi, mobile carrier NAT, VPNs), which is exactly why
// visitor counting also relies on the visitor_id cookie, not IP alone.
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || null;
}

// Vercel's edge network stamps every request with the visitor's approximate
// country/region/city as headers, resolved from its own network — this is
// NOT a third-party IP-geolocation API call, no request ever leaves Vercel's
// infrastructure, and no external service ever sees a visitor's IP. Locally
// (vercel dev / vite dev) these headers are simply absent, so everything
// below degrades to null rather than throwing.
// Docs: https://vercel.com/docs/edge-network/headers#request-headers
export function getClientGeo(req) {
  const country = req.headers['x-vercel-ip-country'] || null;
  const region = req.headers['x-vercel-ip-country-region'] || null;
  const city = req.headers['x-vercel-ip-city']
    ? decodeURIComponent(req.headers['x-vercel-ip-city'])
    : null;

  return { country, region, city };
}
