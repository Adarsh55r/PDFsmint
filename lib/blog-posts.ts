export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "tip"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description — keep under ~160 characters. */
  description: string;
  /** Short teaser shown on blog index cards. */
  excerpt: string;
  category: string;
  publishedAt: string;
  /** Tool hrefs (from lib/navigation.ts) to surface as "Related tools". */
  relatedTools: string[];
  content: BlogContentBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-client-side-pdf-tools",
    title: "Why Client-Side PDF Tools Matter (And How They Protect Your Files)",
    description:
      "Understand why processing PDFs directly in your browser is safer than uploading them to a server, and how to verify a tool actually keeps your files private.",
    excerpt:
      "Most \u201cfree\u201d PDF tools quietly upload your file to a server before doing anything with it. Here's why that matters, and how to tell when a tool skips that step entirely.",
    category: "Privacy",
    publishedAt: "2026-01-15",
    relatedTools: ["/tools/compress-pdf", "/tools/merge-pdf"],
    content: [
      {
        type: "paragraph",
        text: "You search \u201ccompress pdf online,\u201d click the first result, and drop in a file without a second thought. It's a habit most of us have picked up. But that file might contain a signed contract, a bank statement, or a scan of your passport \u2014 and the moment you upload it, you're trusting a stranger's server with it, even if just for a few seconds.",
      },
      {
        type: "heading",
        text: "What \u201cclient-side\u201d actually means",
      },
      {
        type: "paragraph",
        text: "A client-side tool runs entirely inside your browser using JavaScript, often backed by the same WebAssembly technology that powers browser-based games and video editors. Your file is read directly from your device into your browser's memory, transformed there, and handed back to you as a download. It never travels across the internet, because there's nothing on the other end to send it to.",
      },
      {
        type: "heading",
        text: "What happens with a typical server-based tool",
      },
      {
        type: "list",
        items: [
          "Your file is uploaded to a remote server before any processing starts.",
          "It's temporarily written to that server's disk or memory.",
          "\u201cDeleted after 1 hour\u201d is usually a policy, not something you can verify.",
          "Some services reserve the right to use uploaded content to improve their products.",
          "Every upload and download is one more place a breach or misconfiguration can expose your data.",
        ],
      },
      {
        type: "heading",
        text: "Why this matters more for certain documents",
      },
      {
        type: "list",
        items: [
          "Contracts and agreements with financial or legal terms",
          "ID scans, passports, and visa documents",
          "Medical records and insurance paperwork",
          "Payroll, invoices, and other business financials",
          "Anything covered by an NDA before it's publicly released",
        ],
      },
      {
        type: "heading",
        text: "How to check whether a tool really is private",
      },
      {
        type: "paragraph",
        text: "You don't have to take a privacy claim on faith. Most browsers include developer tools that let you watch every network request a page makes in real time.",
      },
      {
        type: "tip",
        text: "Try it yourself: open your browser's developer tools (press F12 or right-click \u2192 Inspect), switch to the \u201cNetwork\u201d tab, then use any tool on this site. You'll see requests for scripts, fonts, and images \u2014 but none carrying your file's contents. You can even switch to airplane mode after the page loads and the tool will keep working.",
      },
      {
        type: "heading",
        text: "The honest trade-off",
      },
      {
        type: "paragraph",
        text: "Browser-based processing depends on your own device's memory and CPU, so an extremely large file \u2014 think a 1,000-page scanned PDF \u2014 may take longer than it would on a beefy server. That's a deliberate trade-off: a little more patience in exchange for your files never leaving your computer.",
      },
      {
        type: "paragraph",
        text: "If you'd like to see this in practice, try the Compress PDF or Merge PDF tools and watch the Network tab yourself \u2014 no upload bar, no waiting on a server, just your file going straight from your disk back to a download.",
      },
    ],
  },
  {
    slug: "how-to-compress-pdf-without-losing-quality",
    title: "How to Compress a PDF Without Losing Quality",
    description:
      "Learn the difference between lossless and lossy PDF compression, and follow a step-by-step guide to shrink file size while keeping text and images sharp.",
    excerpt:
      "Scared that shrinking your PDF will leave it blurry? Here's how compression actually works, and how to pick a setting that won't wreck your document.",
    category: "PDF Tools",
    publishedAt: "2026-02-03",
    relatedTools: ["/tools/compress-pdf", "/tools/split-pdf"],
    content: [
      {
        type: "paragraph",
        text: "Your PDF bounces back from an email server with a message about attachment limits, or an upload form flatly rejects it for being too large. The fix seems obvious \u2014 compress it \u2014 but the last time you tried a random online tool, the result came back noticeably blurry. Here's what's really going on, and how to avoid that.",
      },
      {
        type: "heading",
        text: "Why PDFs get so large in the first place",
      },
      {
        type: "list",
        items: [
          "Pages scanned at a much higher resolution than needed for screen viewing",
          "Photos embedded at full camera resolution instead of resized for the page",
          "Duplicate copies of the same font embedded multiple times",
          "Leftover metadata and unused objects from the software that created the file",
          "Files exported straight from design software at print-ready quality",
        ],
      },
      {
        type: "heading",
        text: "Lossless vs. lossy compression, in plain terms",
      },
      {
        type: "paragraph",
        text: "Lossless compression repacks the file's internal structure \u2014 removing redundancy, deduplicating fonts \u2014 without touching a single pixel or character. The savings are real but modest. Lossy compression instead re-renders each page at a lower image quality, which can shrink file size dramatically but does involve a genuine trade-off in visual fidelity. A good compressor uses lossless techniques wherever possible and only falls back to lossy rendering when it meaningfully helps.",
      },
      {
        type: "heading",
        text: "Step-by-step: compressing a PDF",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Open the Compress PDF tool.",
          "Drop in or select the file you want to shrink.",
          "Choose a compression level: Low, Standard, or Extreme.",
          "Wait for processing to finish \u2014 this happens in your browser, so no upload is needed.",
          "Compare the original size against the new size before downloading.",
        ],
      },
      {
        type: "heading",
        text: "Picking the right compression level",
      },
      {
        type: "paragraph",
        text: "Low targets roughly a 10% reduction and prioritizes keeping text and images as crisp as possible \u2014 a safe choice for contracts or anything with fine print. Standard aims for around 20% smaller and is a sensible default for everyday documents like reports or presentations. Extreme pushes for about 40% smaller by being more aggressive with image quality, which works well for scanned, photo-heavy PDFs where some visible softness is an acceptable trade for a much smaller file.",
      },
      {
        type: "tip",
        text: "If your PDF is mostly typed text rather than scanned images, a tool that preserves the underlying text layer can shrink the file with essentially zero visible quality loss \u2014 that's why even the \u201cLow\u201d setting can still make a real difference.",
      },
      {
        type: "heading",
        text: "Other ways to shrink a PDF before you even compress it",
      },
      {
        type: "list",
        items: [
          "Remove pages you don't actually need to send using Split PDF.",
          "Flatten or delete unused interactive form fields.",
          "Resize oversized photos before they're inserted into the document.",
          "If the recipient only needs part of the file, split it instead of sending everything.",
        ],
      },
      {
        type: "paragraph",
        text: "Compression doesn't have to mean compromise. Pick the level that matches what the document is for, and you'll end up with a file that's both smaller and still perfectly readable.",
      },
    ],
  },
  {
    slug: "how-to-merge-pdf-files",
    title: "How to Merge Multiple PDF Files Into One (Step-by-Step Guide)",
    description:
      "A clear, step-by-step guide to combining multiple PDF files into a single document in your browser, plus tips for keeping the page order correct.",
    excerpt:
      "Combining scanned receipts or report sections into a single PDF sounds simple \u2014 until the pages come out in the wrong order. Here's how to do it right the first time.",
    category: "PDF Tools",
    publishedAt: "2026-02-18",
    relatedTools: ["/tools/merge-pdf", "/tools/split-pdf", "/tools/edit-pdf"],
    content: [
      {
        type: "paragraph",
        text: "You've got a handful of scanned receipts, a cover letter, and a resume \u2014 all separate PDFs \u2014 and a submission form that only accepts one file. Merging them sounds trivial until the pages land in the wrong order in the final document. Here's a workflow that avoids that.",
      },
      {
        type: "heading",
        text: "When merging PDFs actually helps",
      },
      {
        type: "list",
        items: [
          "Combining scanned receipts into a single expense report",
          "Assembling a job application packet: cover letter, resume, references",
          "Joining chapters or sections of a longer report into one file",
          "Creating a single onboarding packet for a new employee",
        ],
      },
      {
        type: "heading",
        text: "Step-by-step: merging PDFs in your browser",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Open the Merge PDF tool.",
          "Add every file you want to combine.",
          "Use the reorder controls to set the final page order.",
          "Review the list one more time before merging.",
          "Click Merge, then download the combined file.",
        ],
      },
      {
        type: "heading",
        text: "Keeping the order correct without the guesswork",
      },
      {
        type: "list",
        items: [
          "Rename files with a numeric prefix before uploading, like 01-cover-letter.pdf and 02-resume.pdf, so they naturally sort in the right order.",
          "Do one final visual check of the list in the tool right before merging.",
          "Keep your original individual files as a backup in case you need to rebuild the order later.",
        ],
      },
      {
        type: "heading",
        text: "Working within sensible limits",
      },
      {
        type: "paragraph",
        text: "To keep everything running smoothly directly in your browser's memory, the Merge PDF tool supports up to 30 files or 150 MB combined in a single batch. If you're working with more than that, merge in two smaller batches and combine the results afterward \u2014 it only takes a second pass.",
      },
      {
        type: "heading",
        text: "Merged the wrong pages? Here's the fix",
      },
      {
        type: "paragraph",
        text: "If you've already merged and realize a page is out of place, you don't need to start over. Use Split PDF to pull out the pages you need, or Edit PDF to reorder, rotate, or delete individual pages inside the merged file directly.",
      },
      {
        type: "paragraph",
        text: "A few seconds of prep \u2014 naming your files sensibly and double-checking the order \u2014 turns merging from a source of frustration into a genuinely quick task.",
      },
    ],
  },
  {
    slug: "pdf-to-word-conversion-guide",
    title: "PDF to Word Conversion: What Actually Works and How to Get Clean Results",
    description:
      "An honest guide to converting PDF files into editable Word documents, including what converts cleanly, what doesn't, and how to get the best result.",
    excerpt:
      "PDF-to-Word converters promise pixel-perfect results. Here's what's realistic to expect, what commonly breaks, and how to get the cleanest conversion possible.",
    category: "PDF Tools",
    publishedAt: "2026-03-05",
    relatedTools: ["/tools/pdf-to-word", "/tools/word-to-pdf", "/tools/edit-pdf"],
    content: [
      {
        type: "paragraph",
        text: "Someone sends you a PDF and asks for a small change. Retyping the whole thing feels wasteful, so you reach for a PDF-to-Word converter, expecting an exact copy you can simply edit. The reality is a little more nuanced \u2014 and knowing what to expect saves a lot of frustration.",
      },
      {
        type: "heading",
        text: "How PDF-to-Word conversion actually works",
      },
      {
        type: "paragraph",
        text: "A PDF doesn't store \u201cparagraphs\u201d the way Word does \u2014 it stores individual pieces of text positioned at exact coordinates on a page. A converter reads that text layer, groups nearby pieces into lines based on their vertical position, and stitches lines into paragraphs based on the gaps between them. It's closer to reconstructing a document's structure than taking a screenshot of it.",
      },
      {
        type: "heading",
        text: "What converts cleanly",
      },
      {
        type: "list",
        items: [
          "Plain typed text and standard paragraphs",
          "Single-column reports, letters, and memos",
          "Straightforward numbered or bulleted lists",
          "Simple, consistent headings",
        ],
      },
      {
        type: "heading",
        text: "What doesn't survive conversion perfectly",
      },
      {
        type: "list",
        items: [
          "Multi-column layouts, like newsletters or academic papers",
          "Tables with merged or irregular cells",
          "Exact fonts, spacing, and page breaks from the original",
          "Images with text wrapped tightly around them",
          "Scanned or photographed pages with no real text layer at all",
        ],
      },
      {
        type: "heading",
        text: "Why scanned PDFs are the real exception",
      },
      {
        type: "paragraph",
        text: "If a PDF is essentially a photo of a page \u2014 common with scanned forms or old documents \u2014 there's no text for a converter to read, so the output will come back empty or nearly empty. That's not a bug in the conversion; it's a fundamental limit of text extraction. Recovering text from a scanned image requires OCR (optical character recognition), which is a different technology entirely and works best as a dedicated, separate step.",
      },
      {
        type: "heading",
        text: "Getting the cleanest possible result",
      },
      {
        type: "list",
        items: [
          "Use it on single-column, text-heavy documents for the most reliable outcome.",
          "Expect to touch up heading styles and spacing once the file opens in Word.",
          "Rebuild complex tables manually if the automatic version looks off.",
          "Keep the original PDF on hand as a reference for exact layout and formatting.",
        ],
      },
      {
        type: "heading",
        text: "Converting back to PDF when you're done editing",
      },
      {
        type: "paragraph",
        text: "Once your edits are in, use Word to PDF to turn the document back into a shareable PDF. For smaller tweaks \u2014 reordering pages, rotating a scanned page, removing a cover sheet \u2014 Edit PDF often gets the job done without a full round-trip through Word at all.",
      },
      {
        type: "paragraph",
        text: "Set the right expectation going in \u2014 great for typed, simple documents, imperfect for complex layouts \u2014 and PDF-to-Word conversion becomes a genuinely useful shortcut instead of a disappointment.",
      },
    ],
  },
  {
    slug: "resize-compress-images-for-web",
    title: "How to Resize and Compress Images for a Faster Website (Without Losing Quality)",
    description:
      "Learn the right order to resize and compress images for the web, which format to pick, and how to avoid blurry or oversized photos on your site.",
    excerpt:
      "A single unoptimized photo can slow down an entire page. Here's the right order of operations for resizing and compressing images before you publish.",
    category: "Image Tools",
    publishedAt: "2026-03-20",
    relatedTools: ["/tools/resize-image", "/tools/compress-image", "/tools/convert-to-jpg"],
    content: [
      {
        type: "paragraph",
        text: "A photo straight off a modern phone camera is often 4000 pixels wide and several megabytes large. Your website is probably going to display it at 800 pixels wide. Uploading it as-is means every visitor downloads five times more image data than they'll ever actually see \u2014 and that adds up fast across a whole page.",
      },
      {
        type: "heading",
        text: "Resize first, then compress",
      },
      {
        type: "paragraph",
        text: "Resizing an image down to the dimensions it will actually be displayed at removes far more excess data than compression alone ever can. Compressing an oversized image just produces a smaller version of something that was still too big to begin with. Get the dimensions right first, and compression only has to do the smaller job of fine-tuning quality.",
      },
      {
        type: "heading",
        text: "How much does compression really save",
      },
      {
        type: "paragraph",
        text: "Most photos can drop to somewhere between 60% and 80% quality with a difference that's barely noticeable to the eye, while cutting file size substantially. Push much lower than that and you'll start to see visible artifacts \u2014 blotchy patches of color, especially around sharp edges or text within the image.",
      },
      {
        type: "heading",
        text: "A simple three-step workflow",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Resize the image to the maximum width your website or platform actually needs.",
          "Compress it, then compare the result against the original at full zoom.",
          "Convert to JPG if you're starting from a heavier format like PNG or HEIC that isn't necessary for an ordinary photo.",
        ],
      },
      {
        type: "heading",
        text: "Which format should you actually use",
      },
      {
        type: "list",
        items: [
          "JPG \u2014 best for photos and anything with lots of color detail and no transparency.",
          "PNG \u2014 best for logos, screenshots, and graphics that need transparency or sharp, flat colors.",
          "HEIC (the default format on many iPhones) isn't reliably supported by every website or platform \u2014 convert it to JPG first for universal compatibility.",
        ],
      },
      {
        type: "tip",
        text: "Not sure what width to resize to? Check your website theme or platform's recommended image dimensions. Uploading anything larger just gets scaled down by the browser anyway \u2014 wasting bandwidth for every single visitor who loads the page.",
      },
      {
        type: "heading",
        text: "One image at a time, on purpose",
      },
      {
        type: "paragraph",
        text: "These tools process one image at a time by design. That keeps the before-and-after preview accurate and lets you judge quality properly, rather than applying one guessed setting across a whole batch and hoping every photo turned out fine.",
      },
      {
        type: "paragraph",
        text: "A little bit of resizing before you compress \u2014 and picking the right format \u2014 usually does more for page speed than any other single change you can make to your images.",
      },
    ],
  },
];

export const blogPostsBySlug = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post]),
) as Record<string, BlogPost>;

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPostsBySlug[slug];
}

function wordCountOf(block: BlogContentBlock): number {
  const text = block.type === "list" ? block.items.join(" ") : block.text;
  return text.split(/\s+/).filter(Boolean).length;
}

/** Rough reading time estimate based on a 200 words-per-minute pace. */
export function getReadingMinutes(post: BlogPost): number {
  const words = post.content.reduce((sum, block) => sum + wordCountOf(block), 0);
  return Math.max(1, Math.round(words / 200));
}

export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  return blogPosts.filter((post) => post.slug !== slug).slice(0, limit);
}
