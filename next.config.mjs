import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

// `next dev` sets NODE_ENV=development; React Fast Refresh (HMR) needs
// 'unsafe-eval', so we only relax script-src in development.
const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy tuned to what PDFsMint actually uses.
 * Everything runs client-side; there is no first-party API to talk to.
 *
 * NOTE (Google AdSense): when you integrate ads later, add the Google ad
 * domains to the directives marked "AdSense:" below. Nothing else needs to
 * change. Typical domains:
 *   script-src / connect-src : https://pagead2.googlesyndication.com
 *                              https://partner.googleadservices.com
 *                              https://tpc.googlesyndication.com
 *                              https://adservice.google.com
 *   img-src                  : https://*.googlesyndication.com
 *                              https://*.g.doubleclick.net https://*.google.com
 *   frame-src                : https://googleads.g.doubleclick.net
 *                              https://tpc.googlesyndication.com
 */
const contentSecurityPolicy = [
  `default-src 'self'`,
  // 'unsafe-inline' -> our JSON-LD <script> tags + Next.js inline bootstrap.
  // 'wasm-unsafe-eval' -> pdf.js WebAssembly image decoders.
  // 'unsafe-eval' -> DEV ONLY, required by React Fast Refresh.
  // AdSense: append the Google script domains here.
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""}`,
  // Tailwind / Next inject inline styles.
  `style-src 'self' 'unsafe-inline'`,
  // data: + blob: -> canvas-generated image previews and downloads.
  // AdSense: append the Google image domains here.
  `img-src 'self' data: blob:`,
  // next/font self-hosts fonts under /_next; data: as a safe fallback.
  `font-src 'self' data:`,
  // Same-origin only: pdf.js fetches its WASM decoders from our own origin.
  // blob:/data: allow reading generated assets back.
  // AdSense: append the Google ad-serving domains here.
  `connect-src 'self' blob: data:`,
  // pdf.js Web Worker is served from our origin (/pdf.worker.min.mjs) and may
  // also spin up blob: workers.
  `worker-src 'self' blob:`,
  `child-src 'self' blob:`,
  // No first-party iframes today.
  // AdSense: append the Google ad-frame domains here.
  `frame-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `manifest-src 'self'`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    // We use none of these device APIs — explicitly deny them.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

/**
 * Next.js config as a function so we can inspect the build `phase`.
 * This lets us warn ONLY during `next build` (production), without spamming
 * the console during local `next dev` where the localhost fallback is fine.
 */
export default function config(phase) {
  if (phase === PHASE_PRODUCTION_BUILD && !process.env.NEXT_PUBLIC_SITE_URL) {
    // eslint-disable-next-line no-console
    console.warn(
      [
        "",
        "⚠️  NEXT_PUBLIC_SITE_URL is not set for this production build.",
        "   Canonical URLs, sitemap.xml, robots.txt and OG/Twitter tags will",
        "   fall back to http://localhost:3000, which breaks SEO and social",
        "   sharing in production.",
        "",
        "   Set it in your Vercel project:",
        "   Settings → Environment Variables → NEXT_PUBLIC_SITE_URL",
        "   e.g. https://your-project.vercel.app  (or your custom domain later)",
        "",
      ].join("\n"),
    );
  }

  return nextConfig;
}
