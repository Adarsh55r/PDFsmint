/**
 * Single source of factual, user-facing information about each tool:
 * accepted inputs, limits, and output. Used by the category hub pages,
 * the "Formats & limits" tables, and /llms.txt so the same facts appear
 * everywhere.
 *
 * Keep these values in sync with the constants in each tool's widget
 * (MAX_*_SIZE_BYTES, MAX_*_FILES) and lib/pdf-utils (MAX_PAGES). If you
 * change a limit there, change it here too.
 */

export type ToolCategoryId = "pdf" | "image";

export type ToolFacts = {
  href: string;
  name: string;
  category: ToolCategoryId;
  /** One-sentence, factual summary of what the tool does. */
  summary: string;
  input: string;
  limits: string;
  output: string;
  /** Honest note on the most important limitation, if any. */
  caveat?: string;
};

export const toolsCatalog: ToolFacts[] = [
  {
    href: "/tools/compress-pdf",
    name: "Compress PDF",
    category: "pdf",
    summary:
      "Reduces PDF file size with a lossless re-pack, or by re-rendering pages as JPEG images when that saves meaningfully more.",
    input: "PDF",
    limits: "1 file, up to 50 MB and 150 pages",
    output: "PDF",
    caveat:
      "When pages are re-rendered as images, text is no longer selectable and links or form fields are removed.",
  },
  {
    href: "/tools/merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    summary: "Combines several PDFs into one file in the order you choose.",
    input: "PDF",
    limits: "Up to 30 files, 100 MB each, 150 MB in total",
    output: "PDF",
  },
  {
    href: "/tools/split-pdf",
    name: "Split PDF",
    category: "pdf",
    summary:
      "Splits a PDF into single pages or custom page ranges such as 1-3, 5, 8-10.",
    input: "PDF",
    limits: "1 file, up to 100 MB",
    output: "PDF files (a ZIP when there is more than one)",
  },
  {
    href: "/tools/edit-pdf",
    name: "Edit PDF",
    category: "pdf",
    summary:
      "Reorders, rotates, and deletes pages using thumbnails. It does not edit the text on a page.",
    input: "PDF",
    limits: "1 file, up to 80 MB and 150 pages",
    output: "PDF",
  },
  {
    href: "/tools/sign-pdf",
    name: "Sign PDF",
    category: "pdf",
    summary:
      "Places a drawn, typed, or uploaded signature image and a date on any page.",
    input: "PDF; signature image as PNG, JPG, or WebP (up to 5 MB)",
    limits: "1 file, up to 50 MB and 150 pages",
    output: "PDF",
    caveat:
      "Adds a visual signature only. It is not a certificate-based digital signature.",
  },
  {
    href: "/tools/watermark-pdf",
    name: "Watermark PDF",
    category: "pdf",
    summary:
      "Stamps a text or image watermark across pages with adjustable opacity, angle, and size.",
    input: "PDF; watermark image as PNG or JPG",
    limits: "1 file, up to 100 MB",
    output: "PDF",
  },
  {
    href: "/tools/n-up-pdf",
    name: "N-Up PDF",
    category: "pdf",
    summary:
      "Places 2, 4, 6, or 9 pages on each sheet for printing handouts or saving paper.",
    input: "PDF",
    limits: "1 file, up to 50 MB and 150 pages",
    output: "PDF",
  },
  {
    href: "/tools/pdf-to-word",
    name: "PDF to Word",
    category: "pdf",
    summary:
      "Extracts the text and paragraph flow of a digital PDF into an editable .docx file.",
    input: "PDF with selectable text",
    limits: "1 file, up to 50 MB and 150 pages",
    output: "DOCX",
    caveat:
      "Does not keep the original layout, fonts, or images, and cannot read scanned PDFs (no OCR).",
  },
  {
    href: "/tools/word-to-pdf",
    name: "Word to PDF",
    category: "pdf",
    summary:
      "Converts a .docx document, including headings, lists, tables, and images, into a PDF.",
    input: "DOCX (older .doc files must be re-saved as .docx)",
    limits: "1 file, up to 25 MB",
    output: "PDF",
    caveat:
      "Pages are usually captured as images, so text in the PDF is not selectable.",
  },
  {
    href: "/tools/pdf-to-jpg",
    name: "PDF to JPG",
    category: "pdf",
    summary: "Renders each PDF page as a JPG or PNG image.",
    input: "PDF",
    limits: "1 file, up to 100 MB and 150 pages",
    output: "JPG or PNG images, downloadable together as a ZIP",
  },
  {
    href: "/tools/jpg-to-pdf",
    name: "JPG to PDF",
    category: "image",
    summary:
      "Combines JPG and PNG images into a single PDF, with A4 or fit-to-image page sizes.",
    input: "JPG, PNG",
    limits: "Up to 30 images, 30 MB each, 150 MB in total",
    output: "PDF",
  },
  {
    href: "/tools/compress-image",
    name: "Compress Image",
    category: "image",
    summary:
      "Reduces image file size with a quality slider and shows the before-and-after size.",
    input: "JPG, PNG, WebP",
    limits: "1 image, up to 30 MB",
    output: "JPG",
    caveat:
      "PNG and WebP inputs are saved as JPG, so transparency becomes white.",
  },
  {
    href: "/tools/resize-image",
    name: "Resize Image",
    category: "image",
    summary:
      "Changes an image's width and height in pixels, with an optional locked aspect ratio.",
    input: "JPG, PNG, WebP",
    limits: "1 image, up to 30 MB",
    output: "JPG, PNG, or WebP",
  },
  {
    href: "/tools/convert-to-jpg",
    name: "Convert to JPG",
    category: "image",
    summary:
      "Converts PNG, WebP, GIF, and BMP images to JPG, flattening transparency onto white.",
    input: "PNG, WebP, GIF, BMP",
    limits: "1 image, up to 30 MB",
    output: "JPG",
    caveat:
      "Transparent areas become white, and animated GIFs keep only the first frame.",
  },
];

export const toolCategoryPages: Record<
  ToolCategoryId,
  { href: string; label: string }
> = {
  pdf: { href: "/pdf-tools", label: "PDF Tools" },
  image: { href: "/image-tools", label: "Image Tools" },
};

export function getToolsByCategory(category: ToolCategoryId): ToolFacts[] {
  return toolsCatalog.filter((tool) => tool.category === category);
}
