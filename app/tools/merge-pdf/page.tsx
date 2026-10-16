import type { Metadata } from "next";
import { Download, ListOrdered, Upload } from "lucide-react";

import { MergePdfWidget } from "./MergePdfWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";

const path = "/tools/merge-pdf";
const metaTitle = `Merge PDF Files Online Free – Combine PDFs in Order`;
const metaDescription =
  "Join several PDFs into one file right in your browser. Reorder pages, keep quality, and skip the upload — 100% private and free.";

export const metadata: Metadata = buildMetadata(metaTitle, metaDescription, path);

const faqs = [
  {
    question: "How many PDFs can I combine at once?",
    answer:
      "You can queue as many files as your device memory allows. Most people merge anywhere from two to a few dozen documents without any trouble.",
  },
  {
    question: "Can I control the order pages appear in?",
    answer:
      "Absolutely. After adding your files, use the up and down arrows to arrange them. The final PDF follows the exact order shown in the list.",
  },
  {
    question: "Do you change the quality of my pages?",
    answer:
      "No. Merging copies your original pages byte-for-byte into a new document, so text stays sharp and images keep their original resolution.",
  },
  {
    question: "Where do my files go during merging?",
    answer:
      "Nowhere. Everything happens inside your browser tab using JavaScript. Your documents are never sent to a server or stored online.",
  },
  {
    question: "Can I merge password-protected PDFs?",
    answer:
      "Not directly — encrypted files must have their password removed first. If a locked file is detected, you'll see a clear message telling you which one to fix.",
  },
];

export default function MergePdfPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Merge PDF" },
        ]}
        h1="Merge PDF Files — Combine Documents Instantly"
        trustLine="Arrange and join multiple PDFs into one file, entirely inside your browser."
        application={{ name: "Merge PDF", description: metaDescription, path }}
        howItWorks={[
          {
            icon: Upload,
            title: "Add your PDFs",
            description:
              "Drop in two or more PDF files, or browse to select them from your device.",
          },
          {
            icon: ListOrdered,
            title: "Set the order",
            description:
              "Drag the arrows to rearrange documents until the sequence is exactly how you want it.",
          },
          {
            icon: Download,
            title: "Save one file",
            description:
              "Click merge and download a single combined PDF — no watermark, no signup.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/split-pdf",
            label: "Split PDF",
            description: "Break one PDF into separate pages or ranges.",
          },
          {
            href: "/tools/compress-pdf",
            label: "Compress PDF",
            description: "Shrink the file size of your merged document.",
          },
          {
            href: "/tools/jpg-to-pdf",
            label: "JPG to PDF",
            description: "Turn images into PDF pages before merging.",
          },
          {
            href: "/tools/watermark-pdf",
            label: "Watermark PDF",
            description: "Stamp text or a logo across the final file.",
          },
        ]}
        seoContent={<MergePdfSeoContent />}
      >
        <MergePdfWidget />
      </ToolPageTemplate>
    </>
  );
}

function MergePdfSeoContent() {
  return (
    <div className="space-y-4 leading-relaxed text-neutral-600">
      <h2 className="text-xl font-semibold text-neutral-900">
        Combine PDF documents without giving up your privacy
      </h2>
      <p>
        Juggling separate PDFs is tedious — a signed contract here, an appendix
        there, a cover letter in a third file. This merge tool stitches them into
        one tidy document so you can send a single attachment instead of five.
        Because the work happens on your own machine, even confidential paperwork
        stays private from start to finish.
      </p>
      <p>
        The tool copies each page directly from your source files, which means
        nothing is re-rendered or degraded. Fonts remain selectable, vector
        graphics stay crisp, and photos keep their resolution. You decide the
        running order with a couple of clicks, making it easy to place a title
        page first or move an appendix to the end.
      </p>
      <p>
        People reach for PDF merging in all sorts of situations: assembling a
        portfolio, bundling monthly invoices for accounting, combining scanned
        forms into one submission, or joining chapters of an ebook. Whatever the
        reason, you avoid the usual privacy trade-off of uploading sensitive
        files to an unknown server.
      </p>
      <p>
        When you are finished, download the result instantly or start over with a
        fresh batch. Need to slim the combined file down? Send it straight to our
        compressor, or explore the other PDF tools linked below.
      </p>
    </div>
  );
}
