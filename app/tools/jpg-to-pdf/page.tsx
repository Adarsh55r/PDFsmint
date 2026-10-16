import type { Metadata } from "next";
import { Download, LayoutGrid, Upload } from "lucide-react";

import { JpgToPdfWidget } from "./JpgToPdfWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";

const path = "/tools/jpg-to-pdf";
const metaTitle = `JPG to PDF Converter Free – Images to PDF Online`;
const metaDescription =
  "Turn JPG and PNG images into a single PDF in your browser. Reorder pages, pick A4 or fit-to-image, and keep everything private.";

export const metadata: Metadata = buildMetadata(metaTitle, metaDescription, path);

const faqs = [
  {
    question: "Which image formats can I convert?",
    answer:
      "JPG, JPEG, and PNG files are all supported. Add as many as you like and each one becomes a page in the finished PDF.",
  },
  {
    question: "Can I decide the order of the pages?",
    answer:
      "Yes. After adding your images, use the up and down arrows to arrange them. The PDF follows that exact sequence.",
  },
  {
    question: "What's the difference between the page-size options?",
    answer:
      "‘Fit to image’ makes each page match its picture's dimensions. A4 and US Letter place the image, centred, on a standard document page with a small margin.",
  },
  {
    question: "Will my photos lose quality?",
    answer:
      "No. Images are embedded at their original resolution, so the PDF looks exactly as sharp as the source files.",
  },
  {
    question: "Are my images uploaded to your servers?",
    answer:
      "Not at all. The conversion runs locally in your browser, so your pictures never leave your device.",
  },
];

export default function JpgToPdfPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Image Tools", href: "/image-tools" },
          { label: "JPG to PDF" },
        ]}
        h1="JPG to PDF — Turn Images into a Document"
        trustLine="Combine your photos and scans into one clean PDF, all inside your browser."
        application={{ name: "JPG to PDF", description: metaDescription, path }}
        howItWorks={[
          {
            icon: Upload,
            title: "Add your images",
            description:
              "Drop in JPG or PNG files — one for a single-page PDF, or many for a multi-page document.",
          },
          {
            icon: LayoutGrid,
            title: "Arrange and size",
            description:
              "Reorder the images and choose whether pages fit the picture or use A4 / Letter dimensions.",
          },
          {
            icon: Download,
            title: "Download your PDF",
            description:
              "Generate the file and save it instantly — no watermark and no account needed.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/pdf-to-jpg",
            label: "PDF to JPG",
            description: "Do the reverse — export PDF pages as images.",
          },
          {
            href: "/tools/compress-image",
            label: "Compress Image",
            description: "Shrink photos before converting them.",
          },
          {
            href: "/tools/merge-pdf",
            label: "Merge PDF",
            description: "Combine the result with other PDFs.",
          },
          {
            href: "/tools/compress-pdf",
            label: "Compress PDF",
            description: "Reduce the size of the finished PDF.",
          },
        ]}
        seoContent={<JpgToPdfSeoContent />}
      >
        <JpgToPdfWidget />
      </ToolPageTemplate>
    </>
  );
}

function JpgToPdfSeoContent() {
  return (
    <div className="space-y-4 leading-relaxed text-neutral-600">
      <h2 className="text-xl font-semibold text-neutral-900">
        Package images into a shareable PDF
      </h2>
      <p>
        PDFs are the universal way to send documents that look the same on every
        device. Converting your JPG or PNG images into a PDF is handy for
        submitting photo IDs, compiling receipts, sharing a set of design mockups,
        or handing in scanned homework as one file instead of a dozen loose
        pictures.
      </p>
      <p>
        This converter embeds each image at full resolution, so nothing looks
        blurry or downscaled. You can reorder images freely before generating the
        document, which is useful when your camera named the files out of
        sequence. Choose &ldquo;fit to image&rdquo; when you want borderless
        pages, or A4 / US Letter when the result needs to print neatly.
      </p>
      <p>
        Everything is handled locally by your browser. That matters when the
        images contain personal information — passports, medical forms, or
        financial statements — because the files are never transmitted to a remote
        server or stored in the cloud.
      </p>
      <p>
        After downloading, you can merge the PDF with others, compress it for
        email, or split it again later. The related tools below cover each of
        those follow-up tasks.
      </p>
    </div>
  );
}
