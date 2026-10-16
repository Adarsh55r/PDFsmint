# Content Gaps — PDFsMint

_Last updated: 2026-10-16_

## Closed in this change

- Category hubs with a formats-and-limits table (`/pdf-tools`, `/image-tools`).
- Compress PDF: how the two methods work, which files shrink, what to do when a file is still too big, limitations.
- Guides: sign without printing, JPG vs PNG vs WebP, extract pages, combine receipts.

## Open gaps (ranked)

| # | Gap | Why it matters | Where | Effort |
| --- | --- | --- | --- | --- |
| 1 | **"Get a PDF under a size limit" guide** (1 MB / 2 MB / email / portals) | The SERP is full of size-specific pages; that intent isn't served on our site yet | New blog post, linked from Compress PDF | S |
| 2 | **Measured compression results** | The preset labels claim "~10/20/40%" without data. A documented test set (5–10 public-domain PDFs: scans, text, slides) would replace the claims with evidence and become a citable original asset. | Blog post + preset descriptions | M |
| 3 | **Edit PDF intent mismatch** | "edit pdf" searchers mostly want to change text. The page should say plainly that it edits pages, not text, and target "rearrange", "delete pages" and "rotate". | /tools/edit-pdf copy | S |
| 4 | **Rotate / delete pages sections** | Common tasks the tool already does | H2 sections on /tools/edit-pdf | S |
| 5 | **Split PDF: separate files vs one file** | Users expect that "extract 2, 5, 9" gives one file | FAQ on /tools/split-pdf linking to Edit PDF | XS |
| 6 | **PDF to JPG resolution guidance** | "What DPI?" is a frequent question | FAQ on /tools/pdf-to-jpg | XS |
| 7 | **Printing N-up correctly** | Printer dialogs re-scale pages; explain "Actual size" | FAQ on /tools/n-up-pdf | XS |
| 8 | **Password-protected PDFs** | Every PDF tool rejects them; explain why and what to do | Short guide | S |
| 9 | **About page: who builds this** | Trust (E-E-A-T). Only add real, verifiable information about the owner. | /about | S (owner input needed) |
| 10 | **Screenshots / GIFs of each tool** | Image search, comprehension, and a visible "how it works" | Tool pages (lazy-loaded, below the fold) | M |

## Answer-oriented page pattern

Use this pattern where it fits; don't force it onto every page.

1. **Task as a question** — usually the H1 or the first H2.
2. **Direct answer** in 1–2 sentences, in the first paragraph.
3. **When it applies** — the conditions under which the answer holds.
4. **Steps** — an ordered list.
5. **Limitations** — stated plainly.
6. **Example** — concrete, and real if possible.
7. **Related questions** — FAQ or H3s.
8. **Tool link** — a `toolLink` block in blog content.
