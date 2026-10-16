import type { Metadata } from "next";
import { Download, FileText, Upload } from "lucide-react";

import { PdfToWordWidget } from "./PdfToWordWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";

const path = "/tools/pdf-to-word";
const metaTitle = `PDF to Word Free – Extract Text to Editable DOCX`;
const metaDescription =
  "Pull the text out of a PDF into an editable Word (.docx) file, entirely in your browser. Great for copy-editing digital PDFs — private and free.";

export const metadata: Metadata = buildMetadata(metaTitle, metaDescription, path);

const faqs = [
  {
    question: "Will my Word file look identical to the PDF?",
    answer:
      "Not exactly. This is a text-focused conversion: it recovers the words and paragraph flow so you can edit them, but it doesn't rebuild the original layout, columns, fonts, or images.",
  },
  {
    question: "Does it work on scanned documents?",
    answer:
      "No. Scanned or photographed PDFs are images with no underlying text layer. Converting those would require OCR, which this in-browser tool doesn't perform.",
  },
  {
    question: "What kind of PDFs work best?",
    answer:
      "Digitally created PDFs — exported from Word, Google Docs, web pages, or similar — convert cleanly because their text is already selectable.",
  },
  {
    question: "Which file format do I get?",
    answer:
      "You receive a standard .docx file that opens in Microsoft Word, Google Docs, LibreOffice, and most other word processors.",
  },
  {
    question: "Is my document uploaded to convert it?",
    answer:
      "No. The text extraction and Word file are generated locally in your browser, so nothing is transmitted to a server.",
  },
];

export default function PdfToWordPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "PDF to Word" },
        ]}
        h1="PDF to Word — Extract Editable Text"
        trustLine="Recover the text from a digital PDF into a .docx you can edit — processed privately in your browser."
        application={{ name: "PDF to Word", description: metaDescription, path }}
        howItWorks={[
          {
            icon: Upload,
            title: "Upload a PDF",
            description:
              "Add a text-based PDF. Everything stays on your device throughout.",
          },
          {
            icon: FileText,
            title: "Text is extracted",
            description:
              "We read the PDF's text layer and rebuild it into paragraphs, page by page.",
          },
          {
            icon: Download,
            title: "Download the .docx",
            description:
              "Open the result in Word or Google Docs and edit the text freely.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/word-to-pdf",
            label: "Word to PDF",
            description: "Turn a Word document back into a PDF.",
          },
          {
            href: "/tools/pdf-to-jpg",
            label: "PDF to JPG",
            description: "Export PDF pages as images instead.",
          },
          {
            href: "/tools/compress-pdf",
            label: "Compress PDF",
            description: "Reduce a PDF's file size.",
          },
          {
            href: "/tools/split-pdf",
            label: "Split PDF",
            description: "Extract just the pages you need.",
          },
        ]}
        seoContent={<PdfToWordSeoContent />}
      >
        <PdfToWordWidget />
      </ToolPageTemplate>
    </>
  );
}

function PdfToWordSeoContent() {
  return (
    <div className="space-y-4 leading-relaxed text-neutral-600">
      <h2 className="text-xl font-semibold text-neutral-900">
        Get editable text out of your PDFs
      </h2>
      <p>
        When you need to quote a report, revise a contract draft, or reuse content
        that only exists as a PDF, retyping everything is a waste of time. This
        tool lifts the text straight out of the document and drops it into an
        editable Word file so you can start writing immediately.
      </p>
      <p>
        It&rsquo;s important to be clear about what this does and doesn&rsquo;t do. Perfect,
        pixel-for-pixel PDF-to-Word conversion isn&rsquo;t achievable in the browser —
        that kind of layout reconstruction relies on heavy server-side engines.
        Instead, this converter focuses on the thing most people actually want: the
        words. It reads the PDF&rsquo;s text layer, groups items into lines and
        paragraphs, and preserves the reading order across pages.
      </p>
      <p>
        Because of that approach, it shines on PDFs that were created digitally,
        where the text is already selectable. It cannot help with scanned pages or
        photos of documents, since those contain no text to extract and would need
        optical character recognition. If you can highlight text in your PDF
        viewer, this tool can convert it.
      </p>
      <p>
        The entire process runs locally, so confidential documents never leave your
        machine. Once you have the .docx, you can polish it in your word processor
        and, if needed, export it back to PDF with the related tool below.
      </p>
    </div>
  );
}
