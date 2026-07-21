import type { Metadata } from "next";
import { Download, SlidersHorizontal, Upload } from "lucide-react";

import { SplitPdfWidget } from "./SplitPdfWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const path = "/tools/split-pdf";
const metaTitle = `Split PDF Online Free – Extract Pages & Ranges | ${siteConfig.name}`;
const metaDescription =
  "Break a PDF into single pages or custom ranges in your browser. Download separately or as a ZIP — private, free, and instant.";

export const metadata: Metadata = buildMetadata(metaTitle, metaDescription, path);

const faqs = [
  {
    question: "Can I pull out just a few specific pages?",
    answer:
      "Yes. Choose the custom ranges option and type something like 1-3, 7, 10-12. Each entry is saved as its own PDF file.",
  },
  {
    question: "What happens if I split every page?",
    answer:
      "You'll get one PDF per page, all bundled into a single ZIP so they're easy to download and organise in one go.",
  },
  {
    question: "Is the original document changed?",
    answer:
      "Never. Your source file stays untouched — the tool creates brand-new PDFs from copies of the pages you select.",
  },
  {
    question: "Are my pages uploaded anywhere?",
    answer:
      "No. Splitting runs completely inside your browser, so the contents of your PDF never travel across the internet.",
  },
  {
    question: "Why are multiple files zipped together?",
    answer:
      "Downloading dozens of separate PDFs one by one is painful. Bundling them into a ZIP keeps everything in a single, tidy download.",
  },
];

export default function SplitPdfPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/" },
          { label: "Split PDF" },
        ]}
        h1="Split PDF — Extract Pages Your Way"
        trustLine="Separate any PDF into individual pages or custom ranges, straight from your browser."
        application={{ name: "Split PDF", description: metaDescription, path }}
        howItWorks={[
          {
            icon: Upload,
            title: "Choose a PDF",
            description:
              "Drop in the document you want to divide. Files up to 100 MB are supported.",
          },
          {
            icon: SlidersHorizontal,
            title: "Pick your method",
            description:
              "Split every page into its own file, or enter exact ranges like 1-3, 5 to extract sections.",
          },
          {
            icon: Download,
            title: "Grab your files",
            description:
              "Download a single PDF, or get everything neatly packaged in one ZIP archive.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/merge-pdf",
            label: "Merge PDF",
            description: "Recombine pages into a single document.",
          },
          {
            href: "/tools/compress-pdf",
            label: "Compress PDF",
            description: "Reduce the size of your split files.",
          },
          {
            href: "/tools/pdf-to-jpg",
            label: "PDF to JPG",
            description: "Turn extracted pages into images.",
          },
          {
            href: "/tools/edit-pdf",
            label: "Edit PDF",
            description: "Rotate, reorder, or delete pages.",
          },
        ]}
        seoContent={<SplitPdfSeoContent />}
      >
        <SplitPdfWidget />
      </ToolPageTemplate>
    </>
  );
}

function SplitPdfSeoContent() {
  return (
    <div className="space-y-4 leading-relaxed text-neutral-600">
      <h2 className="text-xl font-semibold text-neutral-900">
        Extract exactly the pages you need
      </h2>
      <p>
        Sometimes you only need chapter three, or you want each scanned receipt
        as its own file. Splitting a PDF lets you carve a large document into
        smaller, purposeful pieces without reaching for expensive desktop
        software. This tool does it in seconds and keeps every page on your own
        device.
      </p>
      <p>
        Two modes cover almost every situation. &ldquo;Every page separately&rdquo;
        is perfect when you want to break a bundle apart completely — think
        separating a stack of invoices for filing. &ldquo;Custom ranges&rdquo;
        gives you precise control, so typing 1-3, 5 produces one file with the
        first three pages and another with page five.
      </p>
      <p>
        Since the split pages are copied rather than re-encoded, the output keeps
        the same crisp text and image quality as the source. When more than one
        file is created, everything is wrapped into a ZIP so you avoid a flurry of
        individual downloads.
      </p>
      <p>
        Once you have your pieces, you might want to recombine some of them, shrink
        their size, or convert a page to an image. The related tools below make
        those next steps just as quick and private.
      </p>
    </div>
  );
}
