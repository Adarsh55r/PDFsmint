# Editorial Calendar — 90 Days

_Starts 2026-10-16. One or two well-researched pieces a week is the ceiling; quality beats quota. Before writing each piece, re-check its target query against GSC once data exists._

Template for every post: target query · intent · audience · competing content · unique value · outline · internal links · evidence needed · business relevance · priority. The table carries the essentials; the outline goes in the PR.

## Weeks 1–4 (detailed)

| Week | Title (working) | Target query / intent | Unique value vs. competing pages | Primary links | Evidence needed | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | ✅ How to Sign a PDF Without Printing It | sign pdf without printing · learn → do | Honest e-signature vs digital-signature section, and what our tool can't do | /tools/sign-pdf | None beyond the product | P1 (published) |
| 1 | ✅ How to Extract Pages From a PDF | extract pages from pdf · do | Explains the "separate files vs one file" trap; decision table | split, edit, merge | — | P1 (published) |
| 1 | ✅ JPG vs PNG vs WebP | jpg vs png vs webp · learn | Situation-based recommendations; conversion caveats | convert-to-jpg, compress, resize | Google's WebP documentation for the size claim | P2 (published) |
| 1 | ✅ Combine Receipts Into One PDF | combine receipts into one pdf · do | Photo tips, mixing photos and PDFs, size control | jpg-to-pdf, merge, compress | — | P2 (published) |
| 2 | How to Get a PDF Under 1 MB, 2 MB, or Any Upload Limit | compress pdf to 1mb · do | One honest page instead of per-size doorways; explains when it's impossible | compress, split, edit | Run the tool on 3–5 public-domain sample PDFs and report actual results | **P1** |
| 3 | We Compressed 10 PDFs: What Actually Shrinks (and What Doesn't) | how much can a pdf be compressed · learn | **Original data**, which competitors don't publish; also fixes the unmeasured preset labels | compress | A real test set with methodology, file sources, and a results table | P1 |
| 4 | How to Rearrange, Rotate, or Delete PDF Pages | rearrange pdf pages / delete pages from pdf · do | Covers all three page operations in one workflow | edit, split | — | P2 |

## Weeks 5–12 (prioritized backlog)

1. **Why can't I open or compress a password-protected PDF?** Explain the troubleshooting, and the difference between an owner password and a user password.
2. **How to print multiple PDF pages on one sheet (2-up, 4-up)**, covering printer dialog pitfalls (n-up-pdf).
3. **PDF to JPG: which resolution (DPI) should you choose?** For slides, print, and social.
4. **How to reduce image file size for an online form**, combining resize and compress, with target dimensions.
5. **Why is my PDF so large?** A diagnostic guide: embedded fonts, images, scans, and duplicate resources.
6. **How to merge PDFs in a specific order** (and fix pages that come out in the wrong order).
7. **Can you compress a PDF without losing quality? What "lossless" really means.** This is a refresh of the 2026-02-03 post with measured data from week 3. Update it rather than writing a duplicate, and set `updatedAt`.
8. **Is it safe to use online PDF tools? A checklist.** Expands the privacy post with a verify-it-yourself walkthrough and screenshots.

**Not planned:** per-size, per-website, or per-country variants ("compress PDF for X portal") unless GSC shows distinct demand *and* the page can say something specific and true about that portal.

## Publishing checklist

- [ ] Target query recorded in KEYWORD_MAP.md; no existing page serves the same intent.
- [ ] Direct answer in the first paragraph.
- [ ] Every product claim is checked against the code (limits in `lib/tools-catalog.ts`).
- [ ] At least one `toolLink` block, and the tool page links back where relevant.
- [ ] `publishedAt` is set; `updatedAt` only on material revisions.
- [ ] `npm run build` passes, and the page renders correctly on mobile.
