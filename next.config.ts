import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Always-on headers. Safe in dev too.
const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

// HTTPS-only + CSP. Gated to production so they never interfere with local dev
// (HMR uses eval; HSTS only matters over TLS). All AI/Stripe/DB calls are
// server-side, so the browser only ever talks to our own origin.
const prodHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "font-src 'self' data:",
      "img-src 'self' data: blob:",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // colombiacentral.com (the bonus country-name domain) permanently redirects to
  // the flagship, so we don't split the brand or duplicate content.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "colombiacentral.com" }],
        destination: "https://colombiancentral.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.colombiacentral.com" }],
        destination: "https://colombiancentral.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: isProd ? [...baseHeaders, ...prodHeaders] : baseHeaders,
      },
    ];
  },
};

export default nextConfig;
