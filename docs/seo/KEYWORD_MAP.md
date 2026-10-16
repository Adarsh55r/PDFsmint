# Keyword Map — PDFsMint

_Last updated: 2026-10-16_

**About the evidence:** no search-volume or keyword-difficulty tool was available, so **no numbers appear here.** "Demand evidence" records what was actually observed:

- **SERP** — the query returns a full page of dedicated tool pages or guides (a sign that publishers find it worth targeting).
- **Category** — a head term that the major PDF tool sites each build a dedicated landing page for.
- **Untested** — a hypothesis to check in GSC or Google autocomplete.

Once GSC has data, add an "Impressions (90d)" column and re-rank.

Priority: **P1** = optimize now · **P2** = next 30 days · **P3** = later or test first.

## Head terms → existing tool pages

| Primary query | Close variants | Intent | Target URL | Demand evidence | Competitive notes | Action | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| compress pdf | reduce pdf size, make pdf smaller, shrink pdf | Do it now | /tools/compress-pdf | Category | iLovePDF, Smallpdf, Adobe, and PDF24 dominate. A new domain is unlikely to rank top 10 for months. | Done: honest method explanation, upload-limit troubleshooting, FAQ. Next: win long-tail variants (below). | P1 |
| merge pdf | combine pdf, join pdf files | Do it now | /tools/merge-pdf | Category | Same incumbents | Add a "merge then compress" workflow note; already linked from the hub. | P2 |
| split pdf | separate pdf pages | Do it now | /tools/split-pdf | Category | Same | Clarify that ranges produce separate files and link to Edit PDF for a single file. | P1 |
| pdf to jpg | convert pdf to image, pdf to png | Do it now | /tools/pdf-to-jpg | Category | Same | Add DPI/quality guidance (scale 2 ≈ 144 DPI). | P2 |
| jpg to pdf | image to pdf, png to pdf | Do it now | /tools/jpg-to-pdf | Category | Same | OK. Link the new receipts guide. | P2 |
| pdf to word | pdf to docx, convert pdf to editable word | Do it now | /tools/pdf-to-word | Category | Competitors offer layout-preserving conversion and OCR; ours is text-only. | Keep the honest positioning: "extract editable text". Don't chase "keep formatting" queries. | P3 |
| word to pdf | docx to pdf | Do it now | /tools/word-to-pdf | Category | Same | The output is usually image-based (now disclosed). Low priority until output text is selectable. | P3 |
| sign pdf | sign pdf online free, add signature to pdf | Do it now | /tools/sign-pdf | SERP | Many e-sign SaaS companies compete; few explain the e-signature vs digital-signature difference honestly. | Done: guide published. | P1 |
| watermark pdf | add watermark to pdf | Do it now | /tools/watermark-pdf | Category | Same | OK. | P3 |
| edit pdf | rearrange / rotate / delete pdf pages | Mixed: most "edit pdf" searchers want to **edit text**, which we don't support. | /tools/edit-pdf | Category | Strong mismatch risk | Target "rearrange pdf pages", "delete pages from pdf" and "rotate pdf" instead; the H1 already says "Reorder, Rotate & Remove Pages". | P2 |
| n-up pdf | multiple pages per sheet, 2 pages per sheet pdf, print handouts | Do it now | /tools/n-up-pdf | Untested | Fewer dedicated competitors | Good niche; add a print-settings FAQ. | P2 |
| resize image | resize image to pixels, change image size | Do it now | /tools/resize-image | Category | Very crowded | OK | P3 |
| compress image | reduce image size, compress jpg | Do it now | /tools/compress-image | Category | Very crowded | OK | P3 |
| convert to jpg | png to jpg, webp to jpg | Do it now | /tools/convert-to-jpg | Category | Crowded | Consider H2 sections for "WebP to JPG" and "PNG to JPG" on the same page. One page; don't split. | P2 |

## Long-tail clusters (where a new site can realistically compete)

| Cluster | Example queries | Intent | Target | Evidence | Action | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| Compress to a size limit | compress pdf to 1mb, under 2mb, to 500kb, for email | Do it now | /tools/compress-pdf + guide | **SERP** (2026-10-16): the results are dedicated "compress PDF to 1MB" pages from BentoPDF, pdf.it, HiPDF, and Adobe | Write **one** guide, "How to get a PDF under a size limit", with honest expectations. Don't make one page per size: the intent is identical, so per-size pages would be doorway-like. | P1 |
| Extract pages | extract pages from pdf, save one page of a pdf | Do it now | /blog/how-to-extract-pages-from-a-pdf → split/edit | **SERP**: Adobe, Smallpdf, BoldSign | Done (published). | P1 |
| Sign without printing | how to sign a pdf without printing | Learn → do | /blog/how-to-sign-a-pdf-without-printing | **SERP**: many guides | Done (published). | P1 |
| e-signature vs digital signature | electronic vs digital signature pdf | Learn | Section in the signing guide | **SERP**: Smallpdf, Soda PDF, UPDF | Covered in the guide; a standalone article only if GSC shows impressions. | P3 |
| Image format choice | jpg vs png, png vs webp, which image format | Learn | /blog/jpg-vs-png-vs-webp | **SERP**: many blogs | Done (published). | P2 |
| Receipts / scans into one PDF | combine receipts into one pdf, photos to one pdf | Do it now | /blog/combine-receipts-into-one-pdf | **SERP** | Done (published). | P2 |
| Private / offline PDF tools | compress pdf without uploading, offline pdf tools | Do it now (trust-led) | Tool pages + privacy guide | **SERP**: BentoPDF and BoldSign already claim in-browser processing | The privacy guide exists. Add a "verify it yourself" video or GIF to strengthen it. | P2 |
| Rotate PDF | rotate pdf, rotate pdf pages permanently | Do it now | /tools/edit-pdf | Category | Consider a short H2 section on the Edit PDF page. Add a dedicated `/tools/rotate-pdf` only if GSC shows demand landing on edit-pdf. | P2 |
| Delete pages | delete pages from pdf, remove a page from pdf | Do it now | /tools/edit-pdf | Category | Same as above. | P2 |
| PDF too large for email | pdf too large to email, gmail attachment limit | Problem | Size-limit guide | Untested | Fold into the size-limit guide. | P1 |
| Scanned PDF to Word | scanned pdf to word | Do it now | — | — | **Don't target.** The tool has no OCR, so ranking for it would mislead users. | — |

## Rules

- One URL per intent. Variants such as "combine pdf" and "merge pdf" belong on one page.
- Don't target queries the product can't satisfy (OCR, editing text inside a PDF, layout-preserving PDF to Word).
- Record each new page's target query here before publishing.
