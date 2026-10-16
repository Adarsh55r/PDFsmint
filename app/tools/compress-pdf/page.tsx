import type { Metadata } from "next";
import Link from "next/link";
import { Download, Minimize2, Upload } from "lucide-react";

import { CompressPdfWidget } from "./CompressPdfWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";

const path = "/tools/compress-pdf";
const metaTitle = `Compress PDF Online Free – No Upload, No Signup`;
const metaDescription =
  "Shrink PDF file size instantly in your browser. Free, private, no signup — files never leave your device.";

export const metadata: Metadata = buildMetadata(
  metaTitle,
  metaDescription,
  path,
);

const faqs = [
  {
    question: "Is this PDF compressor really free?",
    answer:
      "Yes. There are no hidden fees, subscriptions, or watermarks. You can compress as many PDFs as you like directly in your browser.",
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "No. Compression runs entirely on your device using JavaScript. Your PDF never leaves your browser, which keeps sensitive documents private.",
  },
  {
    question: "Will compressing reduce the quality of my PDF?",
    answer:
      "It depends on the file. The tool first tries a lossless re-pack that keeps text and vector graphics exactly as they are. Only when re-rendering the pages as JPEG images saves meaningfully more space does it use that result instead — and the Low, Standard, and Extreme presets control how sharp those images stay.",
  },
  {
    question: "Will I still be able to select and search text after compressing?",
    answer:
      "If the lossless method was used, yes. If the pages were re-rendered as images to reach a smaller size, text is no longer selectable or searchable and links or form fields are removed. The result screen tells you when this happened, so you can keep the original if you need those features.",
  },
  {
    question: "Why did my PDF barely get smaller?",
    answer:
      "PDFs that are mostly text are already compact, so there is little to remove. If the output would be larger than your original, the tool keeps your original file rather than making it bigger. Scanned and photo-heavy PDFs usually shrink the most.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "You can compress PDFs up to 50 MB and 150 pages. Larger files may exceed browser memory limits — if that happens, split the document into smaller parts first, compress each part, and merge them again.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes, on modern mobile browsers. Very large files are easier to process on desktop because phones have less available memory.",
  },
];

export default function CompressPdfPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Compress PDF" },
        ]}
        h1="Compress PDF Online — Free & Instant"
        trustLine="Your files are processed in your browser and never uploaded anywhere."
        application={{
          name: "Compress PDF",
          description: metaDescription,
          path,
        }}
        howItWorks={[
          {
            icon: Upload,
            title: "Upload your PDF",
            description:
              "Drag and drop a PDF or click to browse. Only .pdf files up to 50 MB are accepted.",
          },
          {
            icon: Minimize2,
            title: "Compress locally",
            description:
              "Each page is optimized in your browser — no cloud upload, no waiting in a server queue.",
          },
          {
            icon: Download,
            title: "Download the result",
            description:
              "Compare original and compressed sizes, then download your smaller PDF instantly.",
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
            description: "Separate pages into individual files.",
          },
          {
            href: "/tools/pdf-to-jpg",
            label: "PDF to JPG",
            description: "Export PDF pages as images.",
          },
          {
            href: "/tools/pdf-to-word",
            label: "PDF to Word",
            description: "Convert PDFs into editable documents.",
          },
        ]}
        seoContent={<CompressPdfSeoContent />}
      >
        <CompressPdfWidget />
      </ToolPageTemplate>
    </>
  );
}

function CompressPdfSeoContent() {
  return (
    <div className="space-y-4 text-neutral-600 leading-relaxed">
      <h2 className="text-xl font-semibold text-neutral-900">
        How to make a PDF smaller
      </h2>
      <p>
        Upload the PDF, choose a preset (Low, Standard, or Extreme), and
        download the result. Everything happens in your browser: the file is
        read from your device, compressed in memory, and handed back as a
        download without being sent to a server.
      </p>
      <h3 className="text-lg font-semibold text-neutral-900">
        What the tool actually does to your file
      </h3>
      <p>
        PDFsMint tries two methods and keeps the smallest sensible result. The
        first is a lossless re-pack of the document&rsquo;s internal structure,
        which never changes how a page looks. The second re-renders each page
        as a JPEG image at roughly 108&ndash;144 DPI depending on the preset.
        The image version is only used when it is at least 5% smaller than the
        lossless one, and the original is kept if neither is smaller.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Low</strong> — sharpest output, smallest savings. Best for
          documents you will print.
        </li>
        <li>
          <strong>Standard</strong> — a balance of size and readability for
          email and uploads.
        </li>
        <li>
          <strong>Extreme</strong> — the smallest files, with visibly softer
          images. Good for meeting a strict upload limit.
        </li>
      </ul>
      <h3 className="text-lg font-semibold text-neutral-900">
        Which PDFs shrink the most
      </h3>
      <p>
        Scanned documents, phone photos of paperwork, brochures, and
        image-heavy reports usually see the biggest reductions. PDFs exported
        from a word processor that contain mostly text are already compact, so
        savings are small and the tool may return the original unchanged.
      </p>
      <h3 className="text-lg font-semibold text-neutral-900">
        If your file is still too large for an upload limit
      </h3>
      <ol className="list-decimal space-y-1 pl-5">
        <li>Try the Extreme preset.</li>
        <li>
          Remove pages you do not need with{" "}
          <Link href="/tools/edit-pdf" className="text-primary-700 underline">
            Edit PDF
          </Link>{" "}
          or{" "}
          <Link href="/tools/split-pdf" className="text-primary-700 underline">
            Split PDF
          </Link>
          , then compress again.
        </li>
        <li>
          For a portal that accepts several files, split the document into
          parts and upload each one separately.
        </li>
      </ol>
      <h3 className="text-lg font-semibold text-neutral-900">Limitations</h3>
      <p>
        Password-protected PDFs must be unlocked before compressing. When the
        image method is used, text stops being selectable or searchable and
        links, bookmarks, and form fields are not kept. Files over 50 MB or 150
        pages are not supported, because processing happens within your
        browser&rsquo;s memory.
      </p>
    </div>
  );
}
