# SEO Baseline — PDFsMint

_Recorded: 2026-10-16. Re-measure monthly, using the same sources each time._

## What was measured, and how

| Area | Value | Source / confidence |
| --- | --- | --- |
| Google Search Console (clicks, impressions, CTR, position, indexed pages) | **Unknown** | No GSC access from this environment. |
| Google Analytics / Vercel Web Analytics traffic | **Unknown** | Vercel Web Analytics is installed (`@vercel/analytics`); data lives in the Vercel dashboard. |
| Bing Webmaster Tools | **Unknown** | No access. |
| Referring domains / backlinks | **Unknown** | No reliable data source connected. |
| Keyword rankings | **Unknown** | None tracked. |
| Core Web Vitals (field, CrUX) | **Unknown** | The site is probably too new and low-traffic to have CrUX data; check PageSpeed Insights. |
| Live HTTP behaviour (redirects, apex→www, trailing slash, 404s) | **Unknown** | The production domain was unreachable from this environment (egress policy/DNS), so live checks couldn't run. |
| Brand search visibility | **Weak (one observation)** | A single web search for "pdfsmint.com" (2026-10-16) returned similarly named products (GetPDFMint, PDFMint API, FileMint) and **no pdfsmint.com pages**. This suggests low indexing or authority and real brand-name confusion. It is one search, not a measurement. |

## What is known from the codebase (verified)

- **Framework:** Next.js 14.2 (App Router), React 18, Tailwind. All 33 routes are statically prerendered (`○`/`●` in `next build`).
- **Indexable URLs (sitemap):** homepage, 14 tool pages, 2 category hubs (new), blog index, 9 blog posts, about, contact, privacy policy, terms.
- **Canonical host:** `NEXT_PUBLIC_SITE_URL` (expected `https://www.pdfsmint.com`). Canonicals are absolute.
- **Analytics:** Vercel Web Analytics, without a consent banner (it's cookieless). It can show referrers such as chatgpt.com or perplexity.ai if they send traffic.

### Lab: JavaScript first-load (production build)

| Page group | Before | After this change |
| --- | --- | --- |
| PDF tools that use pdf-lib (compress, merge, split, edit, n-up, watermark, sign, jpg-to-pdf) | 304–309 kB | 103–108 kB |
| Other tool pages | 102–104 kB | unchanged |
| Content pages | 97.4 kB | unchanged |

Lighthouse/LCP/INP were **not** measured in this session. Measure them with PageSpeed Insights on `/`, `/tools/compress-pdf` and `/tools/merge-pdf` (mobile) after deploying.

### Functional baseline (Playwright, Chromium 141, production build)

Before this change, **Compress PDF, PDF to JPG, Edit PDF (thumbnails) and Sign PDF (previews) failed** with `Map.prototype.getOrInsertComputed is not a function`. pdfjs-dist 6.x's modern build depends on that very new built-in, so any visitor whose browser lacks it couldn't use these tools. After switching to the pdf.js legacy build, all 14 tools complete and produce valid output.

## To establish a real baseline (owner action, ~30 minutes)

1. **Google Search Console:** verify the `pdfsmint.com` Domain property (DNS), submit `https://www.pdfsmint.com/sitemap.xml`, and export the last 3 months of Pages and Queries.
2. **Bing Webmaster Tools:** import from GSC and submit the sitemap. Bing data also feeds some AI answer engines.
3. **Run PageSpeed Insights** (mobile) on the three URLs above and record LCP, INP (field, if available), CLS, and TBT (lab).
4. **Vercel Analytics:** record monthly visitors, top pages, and top referrers.
5. Paste the numbers into the table above with the date.
