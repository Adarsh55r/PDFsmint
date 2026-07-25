import type { Metadata } from "next";
import { Download, LayoutGrid, Upload } from "lucide-react";

import { PdfLayoutWidget } from "./PdfLayoutWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const path = "/tools/n-up-pdf";
const metaTitle = `N-Up PDF Layout – 2-Up, 4-Up & More Free Online | ${siteConfig.name}`;
const metaDescription =
  "Combine multiple PDF pages on one sheet (2-up, 4-up, 6-up, 9-up). Print-friendly layouts in your browser — free and private.";

export const metadata: Metadata = buildMetadata(
  metaTitle,
  metaDescription,
  path,
);

const faqs = [
  {
    question: "What is a 2-up or 4-up PDF layout?",
    answer:
      "N-up means placing N source pages onto a single output sheet. 2-up puts two pages side by side; 4-up arranges four pages in a 2×2 grid. It is commonly used to save paper when printing.",
  },
  {
    question: "Will this affect readability?",
    answer:
      "Pages are scaled to fit each slot while keeping their original aspect ratio. Text remains sharp because we embed the original PDF pages rather than converting them to images. Very small type on dense pages may be harder to read at 6-up or 9-up — use 2-up or 4-up for reading.",
  },
  {
    question: "Can I choose which pages go together?",
    answer:
      "Pages are placed in order: page 1 fills the first slot, page 2 the next, and so on. To rearrange pages first, use Edit PDF, then run N-up layout on the result.",
  },
  {
    question: "Is there a page limit?",
    answer:
      "Yes. Files up to 50 MB and 150 pages are supported. Combining many pages into grids is more memory-intensive than a simple merge, so this cap keeps processing reliable in the browser.",
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "No. Layout generation runs entirely in your browser with pdf-lib. Your PDF never leaves your device.",
  },
];

export default function NUpPdfPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/" },
          { label: "N-Up PDF" },
        ]}
        h1="N-Up PDF — Combine Multiple Pages Per Sheet"
        trustLine="Create 2-up, 4-up, 6-up, or 9-up print layouts entirely in your browser — nothing is uploaded."
        application={{
          name: "N-Up PDF Layout",
          description: metaDescription,
          path,
        }}
        howItWorks={[
          {
            icon: Upload,
            title: "Upload your PDF",
            description:
              "Drop in a multi-page PDF (up to 50 MB). Processing stays on your device.",
          },
          {
            icon: LayoutGrid,
            title: "Pick an N-up layout",
            description:
              "Choose 2, 4, 6, or 9 pages per sheet, set orientation and paper size, then generate.",
          },
          {
            icon: Download,
            title: "Download & print",
            description:
              "Get a new PDF with fewer sheets — ready to print, share, or archive as a compact overview.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/merge-pdf",
            label: "Merge PDF",
            description: "Combine multiple PDFs into one document.",
          },
          {
            href: "/tools/split-pdf",
            label: "Split PDF",
            description: "Extract pages into separate files.",
          },
          {
            href: "/tools/edit-pdf",
            label: "Edit PDF",
            description: "Reorder, rotate, or remove pages first.",
          },
          {
            href: "/tools/compress-pdf",
            label: "Compress PDF",
            description: "Shrink the file after creating your layout.",
          },
        ]}
        seoContent={<NUpPdfSeoContent />}
      >
        <PdfLayoutWidget />
      </ToolPageTemplate>
    </>
  );
}

function NUpPdfSeoContent() {
  return (
    <div className="space-y-4 text-neutral-600 leading-relaxed">
      <h2 className="text-xl font-semibold text-neutral-900">
        Print smarter with N-up PDF layouts
      </h2>
      <p>
        An N-up layout places several pages of a document onto a single printed
        sheet. Instead of printing twenty full-size pages, you might print ten
        landscape sheets with two pages each (2-up), or five portrait sheets in a
        2×2 grid (4-up). Schools, offices, and anyone preparing handouts use this
        pattern to cut paper use without rewriting the original file.
      </p>
      <p>
        Beyond saving paper, multi-page sheets are useful as quick-reference
        overviews. A long presentation or report becomes a compact packet you can
        skim at a glance. Designers and reviewers sometimes generate 6-up or 9-up
        thumbnails to compare page flow before a final print run. Because each
        source page is embedded — not rasterized — vector text and drawings stay
        crisp at the smaller size.
      </p>
      <p>
        This tool runs entirely in your browser. Choose how many pages belong on
        each sheet, pick A4 or Letter, set portrait or landscape, and optionally
        keep thin borders so slots stay visually separate when printed. If your
        page count is not divisible by the layout (for example, 10 pages at
        4-up), the last sheet simply leaves unused slots blank — nothing is
        duplicated or dropped.
      </p>
      <p>
        Defaults are chosen for common print jobs: 2-up starts in landscape so
        two pages sit side by side, while denser grids default to portrait for
        handout-style sheets. You can override orientation at any time. When you
        need to rearrange pages first, use Edit PDF, then return here to generate
        the layout.
      </p>
    </div>
  );
}
