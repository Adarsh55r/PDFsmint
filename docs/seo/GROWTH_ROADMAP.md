# 90-Day Organic Growth Roadmap — PDFsMint

_Start: 2026-10-16_

## Reality check on the 100,000-visit goal

100k organic visits a month in 90 days is very unlikely for a domain that doesn't yet show up for its own brand name (see BASELINE.md). The head terms ("compress pdf", "merge pdf") are held by sites with very large link profiles. New domains typically take many months to build enough authority to rank for them.

That isn't a forecast; there's no data yet to forecast from. It's why the plan below optimizes for **compounding inputs** (indexation, long-tail rankings, links earned, working tools) and measures actual progress monthly. Expect head-term traffic, if it comes, after the 90 days.

## Scoring

**Impact** (H/M/L) · **Confidence** in the evidence (H/M/L) · **Effort** (XS–L) · **Risk** of breaking something (H/M/L)

## Phase 0–1: done in this change

| Item | Impact | Conf. | Effort | Risk |
| --- | --- | --- | --- | --- |
| Fix pdf.js crash (4 tools broken on browsers without `getOrInsertComputed`) | **H** (users and engagement signals) | H | S | L (E2E-verified) |
| Fix double-branded titles on all tool pages | H | H | XS | L |
| Category hubs + correct breadcrumbs + nav links | M | M | S | L |
| pdf-lib lazy-load (−200 kB JS on 8 pages) | M (INP/TBT on mobile) | M | S | L (E2E-verified) |
| PNG OG image; removed unowned Twitter handle | L–M (social CTR) | H | XS | L |
| Truthful sitemap lastmod; schema cleanup | L–M | M | XS | L |
| Accuracy fixes (No Limits, rasterization, Word to PDF output, unmeasured %) | M (trust, fewer bounces) | H | XS | L |
| 4 new long-tail guides; blog CTA blocks | M | M | M | L |
| /llms.txt | L (speculative) | L | XS | L |

## Next 2 weeks (owner + engineering)

| # | Item | Impact | Conf. | Effort | Risk | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **Deploy, then verify production** (TECHNICAL_AUDIT.md checklist) | H | H | XS | L | Owner |
| 2 | **Set up GSC + Bing Webmaster Tools, submit the sitemap**, request indexing for the homepage, both hubs, and the top 5 tools | **H** | H | XS | L | Owner |
| 3 | Record the real baseline in BASELINE.md | H (enables everything else) | H | XS | L | Owner |
| 4 | ✅ Removed the visible "Ad placement reserved" box | M | M | XS | L | Done |
| 5 | "Get a PDF under a size limit" guide | M–H | M | S | L | Content |
| 6 | Edit PDF copy: say plainly that it edits pages, not text; add rotate and delete sections | M | M | S | L | Content |
| 7 | PNG app icons (180, 512) and a PNG Organization logo | L | H | XS | L | Eng |

## Days 15–45

| # | Item | Impact | Conf. | Effort | Risk |
| --- | --- | --- | --- | --- | --- |
| 8 | **Original compression test** (10 public-domain PDFs, published method). Replace the unmeasured preset labels with the measured results. | M–H (links, citations, trust) | M | M | L |
| 9 | **Target-size compression feature** ("make it under X MB") | H for the "compress to Xmb" cluster | M | M | M (new code path; needs E2E tests) |
| 10 | `aria-live` result and error announcements in all widgets | L–M | H | S | L |
| 11 | Commit the Playwright E2E suite to the repo and run it in CI before deploys | M (prevents repeats of the pdf.js crash) | H | S | L |
| 12 | Weekly: one guide from EDITORIAL_CALENDAR.md | M | M | M | L |

## Days 45–90

| # | Item | Impact | Conf. | Effort | Risk |
| --- | --- | --- | --- | --- | --- |
| 13 | Use GSC data: rewrite titles and descriptions for pages with impressions but low CTR | M–H | H (data-driven) | S | L |
| 14 | Expand pages ranking in positions 8–20 with the missing subtopics GSC queries reveal | H | H | M | L |
| 15 | **Legitimate link earning:** submit to relevant privacy and open-source tool directories, answer genuine questions on forums where the tool truly fits (disclose affiliation), and pitch the original compression test to relevant newsletters | M–H | M | M | L |
| 16 | Evaluate localization (e.g. Spanish, Portuguese, Hindi) only after the English pages earn impressions; translate the highest performers, done well | M | L | L | M |
| 17 | Evaluate new tools against demand and privacy fit: rotate-pdf landing page, grayscale PDF, OCR (heavy; likely defer) | M | L | M–L | M |

## Monthly measurement (unchanged sources)

- GSC: clicks, impressions, CTR, average position, and indexed pages, by page type (tools / hubs / blog).
- Queries in positions 8–20, which are the expansion candidates.
- Vercel Analytics: visitors, top landing pages, and referrers, including AI assistants (chatgpt.com, perplexity.ai, copilot, gemini).
- PageSpeed Insights (mobile) on 3 template pages.
- E2E suite pass/fail.

## Guardrails

- No per-size, per-city, or per-website doorway pages.
- No claims the code doesn't support; `lib/tools-catalog.ts` is the source of truth for limits.
- No fake ratings, reviews, authors, or statistics.
- Every new dependency is justified by bundle size and privacy impact.
