import type { Metadata } from "next";
import { Download, Minimize2, Upload } from "lucide-react";

import { CompressPdfWidget } from "./CompressPdfWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const path = "/tools/compress-pdf";
const metaTitle = `Compress PDF Online Free – No Upload, No Signup | ${siteConfig.name}`;
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
      "We optimize pages for a balance of size and readability. Image-heavy and scanned PDFs usually shrink significantly. Text-only documents may already be optimized and see smaller savings.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "You can compress PDFs up to 50 MB. Larger files may exceed browser memory limits — if that happens, try closing other tabs or splitting the document first.",
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
          { label: "PDF Tools", href: "/" },
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
        Free online PDF compression that respects your privacy
      </h2>
      <p>
        Large PDF files are difficult to email, slow to upload, and frustrating
        to share. Our compress PDF tool reduces file size directly in your
        browser — no account, no installation, and no data sent to a remote
        server. That makes it a practical choice for contracts, invoices,
        scanned documents, and school assignments where confidentiality matters.
      </p>
      <p>
        When you compress a PDF here, the file is processed locally on your
        device. Pages are analyzed and optimized to remove unnecessary bulk
        while keeping text and images readable. Image-heavy PDFs — such as
        scanned receipts, brochures, or photo albums — often see the biggest
        reductions. Text-based documents may already be efficiently encoded; in
        those cases the tool still returns the best optimized version available.
      </p>
      <p>
        Common reasons people compress PDFs include meeting email attachment
        limits, saving storage space on a phone or laptop, speeding up uploads to
        client portals, and preparing files for web publishing. Because
        everything runs client-side, you can use the tool on a work machine
        without worrying about confidential material passing through third-party
        infrastructure.
      </p>
      <p>
        Simply upload your file, wait a few seconds while compression completes,
        and download the result. If you need to process another document, click
        &ldquo;Compress another file&rdquo; to start over. For related tasks,
        explore our merge, split, and conversion tools linked below.
      </p>
    </div>
  );
}
