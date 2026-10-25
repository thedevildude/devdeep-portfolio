import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * Next's nonce-based policy would make every page render per request, which does not work with
 * this site's cached components and partial prerendering, so scripts keep 'unsafe-inline' (Next's
 * own bootstrap, the homepage loader and Google's tag are inline). What the policy still does:
 * scripts, connections, images, media and frames can only come from this site and Google, so an
 * injected script cannot load code from or send data to anywhere else, and the page cannot be
 * framed, re-based or posted to another site.
 *
 * The Google hosts are what GA4 and the Tag Manager container need. A new third-party tag added
 * in Tag Manager must be added to the lists here, or the browser will block it.
 */
const GOOGLE_SCRIPT = "https://*.googletagmanager.com https://*.google-analytics.com";
const GOOGLE_CONNECT =
  "https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com";
const GOOGLE_IMG =
  "https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com";

const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = (
  isDev
    ? // Dev needs eval for React's debugging and a websocket for hot reload; keep it permissive.
      "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'"
    : [
        "default-src 'self'",
        `script-src 'self' 'unsafe-inline' ${GOOGLE_SCRIPT}`,
        "style-src 'self' 'unsafe-inline'",
        `img-src 'self' data: blob: ${GOOGLE_IMG}`,
        "font-src 'self' data:",
        "media-src 'self' blob:",
        `connect-src 'self' ${GOOGLE_CONNECT}`,
        "frame-src https://www.googletagmanager.com",
        "worker-src 'self' blob:",
        "manifest-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self'",
      ].join("; ")
);

/** Headers sent with every response. */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Don't advertise the framework in every response.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
