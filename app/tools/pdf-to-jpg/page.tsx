import type { Metadata } from "next";
import { Download, Settings2, Upload } from "lucide-react";

import { PdfToJpgWidget } from "./PdfToJpgWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const path = "/tools/pdf-to-jpg";
const metaTitle = `PDF to JPG Free – Convert PDF Pages to Images | ${siteConfig.name}`;
const metaDescription =
  "Export every page of a PDF as a high-quality JPG or PNG in your browser. Preview thumbnails, download all as a ZIP — no upload required.";

export const metadata: Metadata = buildMetadata(metaTitle, metaDescription, path);

const faqs = [
  {
    question: "Do I get one image per page?",
    answer:
      "Yes. Each page in your PDF is rendered as its own image file, and you can download them individually or all together in a ZIP.",
  },
  {
    question: "Should I choose JPG or PNG?",
    answer:
      "Pick JPG for smaller files that are great for sharing and photos. Choose PNG when you need lossless quality or crisp text and line art.",
  },
  {
    question: "How sharp are the exported images?",
    answer:
      "Pages are rendered at roughly twice their base resolution, which produces clear, print-friendly images suitable for most uses.",
  },
  {
    question: "Can it handle a PDF with many pages?",
    answer:
      "Yes, though very large documents use more memory since rendering happens on your device. On phones, extremely long PDFs may be slower.",
  },
  {
    question: "Is my PDF sent anywhere to be converted?",
    answer:
      "No. Rendering is done locally with JavaScript in your browser, so the document's contents never leave your computer.",
  },
];

export default function PdfToJpgPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/" },
          { label: "PDF to JPG" },
        ]}
        h1="PDF to JPG — Save Pages as Images"
        trustLine="Render any PDF into sharp JPG or PNG images, all within your browser."
        application={{ name: "PDF to JPG", description: metaDescription, path }}
        howItWorks={[
          {
            icon: Upload,
            title: "Upload a PDF",
            description:
              "Drop in your document — it stays on your device the entire time.",
          },
          {
            icon: Settings2,
            title: "Choose a format",
            description:
              "Pick JPG for compact files or PNG for lossless, text-sharp images.",
          },
          {
            icon: Download,
            title: "Download images",
            description:
              "Preview the thumbnails, then grab a single image or all of them as a ZIP.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/jpg-to-pdf",
            label: "JPG to PDF",
            description: "Turn images back into a PDF document.",
          },
          {
            href: "/tools/compress-image",
            label: "Compress Image",
            description: "Shrink the exported images further.",
          },
          {
            href: "/tools/split-pdf",
            label: "Split PDF",
            description: "Extract specific pages first.",
          },
          {
            href: "/tools/pdf-to-word",
            label: "PDF to Word",
            description: "Pull editable text out of a PDF.",
          },
        ]}
        seoContent={<PdfToJpgSeoContent />}
      >
        <PdfToJpgWidget />
      </ToolPageTemplate>
    </>
  );
}

function PdfToJpgSeoContent() {
  return (
    <div className="space-y-4 leading-relaxed text-neutral-600">
      <h2 className="text-xl font-semibold text-neutral-900">
        Convert PDF pages into images you can use anywhere
      </h2>
      <p>
        There are plenty of moments when an image beats a PDF: dropping a page
        into a slide deck, posting a snippet to social media, attaching a preview
        in a chat, or embedding a figure in a web page. This converter turns each
        page of your PDF into a standalone JPG or PNG so you can use it wherever
        images are accepted.
      </p>
      <p>
        Pages are rendered at high resolution using the same engine that browsers
        use to display PDFs, so the output stays faithful to the original layout,
        fonts, and colours. JPG keeps file sizes small for quick sharing, while
        PNG preserves every pixel — the better pick for documents with fine text
        or diagrams.
      </p>
      <p>
        The whole process runs on your own machine. Nothing is uploaded, which
        means confidential reports or personal records are converted without ever
        leaving your browser. When several images are produced, they are bundled
        into a single ZIP so downloading is painless.
      </p>
      <p>
        Need to go the other direction, or trim the results down? The related
        tools below let you rebuild a PDF from images, compress the output, or
        extract just the pages you care about.
      </p>
    </div>
  );
}
