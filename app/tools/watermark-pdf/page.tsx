import type { Metadata } from "next";
import { Download, SlidersHorizontal, Upload } from "lucide-react";

import { WatermarkPdfWidget } from "./WatermarkPdfWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";

const path = "/tools/watermark-pdf";
const metaTitle = `Add Watermark to PDF Free – Text or Logo Stamp`;
const metaDescription =
  "Stamp text or an image watermark across every page of a PDF in your browser. Adjust opacity, angle, and size — private and free.";

export const metadata: Metadata = buildMetadata(metaTitle, metaDescription, path);

const faqs = [
  {
    question: "Can I use my company logo as a watermark?",
    answer:
      "Yes. Switch to the image option and upload a PNG or JPG. Transparent PNG logos work especially well laid over document pages.",
  },
  {
    question: "Will the watermark appear on every page?",
    answer:
      "Yes, the stamp is applied to all pages automatically so your branding or notice is consistent throughout the document.",
  },
  {
    question: "How do I make the watermark subtle?",
    answer:
      "Lower the opacity slider. A setting around 20–35% keeps text readable underneath while still making the watermark clearly visible.",
  },
  {
    question: "Can I tile the text across the whole page?",
    answer:
      "Yes. Choose the tiled placement for text watermarks and the phrase repeats in a grid — ideal for ‘DRAFT’ or ‘CONFIDENTIAL’ notices.",
  },
  {
    question: "Does my file get uploaded to add the watermark?",
    answer:
      "No. The watermarking happens entirely in your browser using JavaScript, so the document and any logo you add stay on your device.",
  },
];

export default function WatermarkPdfPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Watermark PDF" },
        ]}
        h1="Watermark PDF — Stamp Text or a Logo"
        trustLine="Overlay a text notice or image across your PDF pages without uploading a thing."
        application={{ name: "Watermark PDF", description: metaDescription, path }}
        howItWorks={[
          {
            icon: Upload,
            title: "Open your PDF",
            description:
              "Drop in the document you want to mark. Everything is processed locally in your browser.",
          },
          {
            icon: SlidersHorizontal,
            title: "Design the stamp",
            description:
              "Type a phrase or upload a logo, then fine-tune opacity, angle, colour, and size to taste.",
          },
          {
            icon: Download,
            title: "Save the result",
            description:
              "Apply the watermark to every page and download the finished PDF instantly.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/merge-pdf",
            label: "Merge PDF",
            description: "Combine watermarked files into one.",
          },
          {
            href: "/tools/compress-pdf",
            label: "Compress PDF",
            description: "Shrink the marked document for sharing.",
          },
          {
            href: "/tools/edit-pdf",
            label: "Edit PDF",
            description: "Reorder, rotate, or remove pages.",
          },
          {
            href: "/tools/split-pdf",
            label: "Split PDF",
            description: "Separate pages before or after stamping.",
          },
        ]}
        seoContent={<WatermarkPdfSeoContent />}
      >
        <WatermarkPdfWidget />
      </ToolPageTemplate>
    </>
  );
}

function WatermarkPdfSeoContent() {
  return (
    <div className="space-y-4 leading-relaxed text-neutral-600">
      <h2 className="text-xl font-semibold text-neutral-900">
        Brand and protect your documents with a watermark
      </h2>
      <p>
        A watermark is a simple way to signal ownership, status, or
        confidentiality. Marking a proposal as &ldquo;DRAFT&rdquo;, stamping
        &ldquo;PAID&rdquo; on an invoice, or laying a company logo across every
        page all help readers understand a document at a glance — and discourage
        unauthorised reuse.
      </p>
      <p>
        This tool supports both text and image watermarks. With text you control
        the wording, colour, transparency, rotation, and whether the phrase sits
        in the centre or repeats across the page. With an image you can drop in a
        logo, set how large it appears, and dial the opacity down so it blends
        gently behind your content.
      </p>
      <p>
        Because the stamp is written directly into the PDF on your own device, the
        file never touches a server. That keeps sensitive contracts and internal
        reports private, which is exactly when watermarks matter most.
      </p>
      <p>
        After watermarking, you may want to merge the file with a cover page,
        compress it for email, or rearrange pages. Those follow-up tools are
        linked just below.
      </p>
    </div>
  );
}
