# Technical SEO Audit — PDFsMint

_Audit date: 2026-10-16. Based on the repository and a local production build. The live site couldn't be reached from the audit environment, so production-only behaviour is listed under "Verify in production"._

Status key: ✅ fixed in this change · ⚠️ open · ℹ️ OK as is

## Architecture

- Next.js 14 App Router; every route is static HTML at build time, so tool page content, FAQs, and links are present in the initial HTML. ℹ️
- Tool UIs are client components inside server-rendered pages. Crawlers see the H1, intro, steps, explanatory content, FAQ, and related links without running JS. ℹ️
- Metadata: `lib/seo-config.ts` `generateMetadata()`, used by every page. ℹ️
- JSON-LD: `components/seo/JsonLd.tsx`. ℹ️
- Security headers and CSP in `next.config.mjs`. ℹ️

## Findings

### Critical

1. ✅ **PDF tools broken on browsers without `Map.prototype.getOrInsertComputed`.** pdfjs-dist 6.1's modern build calls it unpolyfilled, which broke Compress PDF, PDF to JPG, Edit PDF, and Sign PDF in Chromium 141. **Fix:** use `pdfjs-dist/legacy/build/pdf.mjs` and the legacy worker in `public/`. Keep them in sync with `npm run copy:pdf-worker` after upgrading pdfjs-dist.
2. ✅ **Double-branded, overlong titles on all 14 tool pages**, e.g. `Compress PDF Online Free – No Upload, No Signup | PDFsMint | PDFsMint – Free Online PDF & Image Tools` (110 chars). Each page title included the brand, then the layout template added "| PDFsMint – Free Online PDF & Image Tools". **Fix:** the template is now `%s | PDFsMint`. Titles are now 48–64 characters.

### High

3. ✅ **Literal `—` shown on /blog** (an escape sequence inside JSX text).
4. ✅ **Breadcrumbs pointed "PDF Tools"/"Image Tools" at the homepage**, so BreadcrumbList said the category was `/`. **Fix:** new hub pages `/pdf-tools` and `/image-tools`, which have real content: grouped tools, a formats-and-limits table, and workflows.
5. ✅ **OG image was SVG.** Facebook, LinkedIn, and X don't render SVG `og:image`, so shares showed no image, and the SVG itself contained corrupted characters (U+FFFD). **Fix:** a 1200×630 PNG at `public/og-images/default.png`, plus a repaired SVG.
6. ✅ **Inaccurate claims:**
   - The homepage H1 said "No Limits", but tools have file-size and page caps.
   - Compress PDF didn't tell users when output was rasterized, which makes text unselectable and drops links and forms.
   - Word to PDF didn't disclose that its output is usually image-based.
   - Compress Image claimed an unmeasured "60–80%" reduction.

   All four are now fixed.
7. ✅ **Sitemap `lastmod` = build time for every URL.** It changed on every deploy, which teaches Google to ignore it. **Fix:** `lastmod` is only emitted where a real date exists (blog posts and the blog index).
8. ✅ **pdf-lib (~200 kB) loaded on page load** on 8 PDF tool pages. It's now dynamically imported when processing starts.

### Medium

9. ✅ `twitter:site`/`twitter:creator` were set to `@pdfsmint`, but the footer's TODO says no social accounts exist yet. Removed. Re-add the handle once the account is registered.
10. ✅ The schema used `SoftwareApplication` with `applicationCategory: "Utility"`, which isn't a recognised value. It's now `WebApplication` + `UtilitiesApplication`, with a single `Organization` node (`/#organization`) referenced by `WebSite`, tools, and posts.
11. ✅ JSON-LD wasn't escaped. `<` is now emitted as `<`, so a value containing `</script>` can't break out of the tag.
12. ✅ Blog posts had no contextual tool links (plain-text blocks only). Added `toolLink` and `table` block types, and related posts now match by shared tools.
13. ⚠️ **FAQPage schema** is present on the homepage and every tool page. It matches visible content, so it isn't spam, but Google shows FAQ rich results only for well-known government and health sites (change announced August 2023). Keep it (harmless and descriptive), but don't expect FAQ snippets.
14. ⚠️ **The compress preset labels claim savings** ("Up to 40% / Around 20% / Around 10% smaller") that weren't measured, and the 2026-02-03 blog post repeats them. Real results vary from 0% to over 80% depending on the file. Replace them with a qualitative description, or run a documented test set and publish those results.
15. ✅ **A visible "Ad placement reserved — Google AdSense slot" box** appeared in the footer of every page. Removed; re-add a real ad unit when AdSense is live.
16. ⚠️ **`theme-color`, `apple-touch-icon` and the Organization logo use an SVG.** iOS ignores SVG apple-touch-icons. Add 180×180 and 512×512 PNG icons.
17. ⚠️ **`robots.txt` contains `Host:`** (only Yandex reads it) **and `Disallow: /api/`** (no API exists). Both are harmless, so they're left as is.

### Low

18. ✅ The progress bar had no accessible name. Added `aria-label`.
19. ⚠️ Most widgets don't announce completion or errors through `aria-live`; only Sign PDF and Edit PDF do. Add `role="status"` to result and error containers.
20. ⚠️ The repo isn't Prettier-clean (75 files before this change). Run `npm run format` in a separate, formatting-only commit.

## Verify in production (couldn't be tested from the audit environment)

- [ ] `http://pdfsmint.com`, `https://pdfsmint.com` and `http://www.pdfsmint.com` each 301/308 to `https://www.pdfsmint.com/` in **one** hop.
- [ ] `/tools/compress-pdf/` (trailing slash) redirects to the no-slash URL (Next.js default 308).
- [ ] An unknown URL returns **404**, not 200.
- [ ] `NEXT_PUBLIC_SITE_URL` is set in Vercel Production. Otherwise canonicals point to localhost, and the build prints a warning.
- [ ] `/sitemap.xml`, `/robots.txt` and `/llms.txt` return 200 with the expected content.
- [ ] The URL Inspection tool in GSC renders `/tools/compress-pdf` with the FAQ and content visible.

## AI crawlers

- `robots.txt` allows all user agents, so GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and Bingbot are not blocked. No change recommended.
- `/llms.txt` is generated from the same catalog as the tool pages, so it can't drift from them. It's a proposal, not a standard, and there is no evidence it affects citations; it was added because it costs nothing to maintain.
- There are no sensitive endpoints: the site has no server-side file handling at all.
