import type { Metadata } from "next";
import { Download, FileText, Upload } from "lucide-react";

import { WordToPdfWidget } from "./WordToPdfWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";

const path = "/tools/word-to-pdf";
const metaTitle = `Word to PDF Free – Convert DOCX to PDF Online`;
const metaDescription =
  "Convert Word (.docx) documents to PDF in your browser. Keeps headings, lists, tables, and images — private, free, and no signup.";

export const metadata: Metadata = buildMetadata(metaTitle, metaDescription, path);

const faqs = [
  {
    question: "Which Word files can I convert?",
    answer:
      "Modern .docx files created by Word, Google Docs, or LibreOffice are supported. Older .doc files must be re-saved as .docx first.",
  },
  {
    question: "How faithful is the conversion?",
    answer:
      "Everyday formatting like headings, paragraphs, bullet lists, tables, bold and italic text, and inline images comes through well. Very intricate page layouts may look slightly different.",
  },
  {
    question: "Do headers, footers, and page numbers carry over?",
    answer:
      "Those Word-specific features aren't reliably reproduced in a browser conversion, so they may be dropped. The main body content is the focus.",
  },
  {
    question: "Can I select or search the text in the converted PDF?",
    answer:
      "Usually not. To keep the layout faithful in a browser, each page is captured as an image and placed into the PDF, so the text looks right but isn't selectable or searchable. If a page can't be captured, the tool falls back to a plain-text PDF with simplified formatting. If you need selectable text, export to PDF from Word, Google Docs, or LibreOffice instead.",
  },
  {
    question: "Will my images be included?",
    answer:
      "Yes. Pictures embedded in the document are carried into the PDF automatically at their original positions in the text.",
  },
  {
    question: "Is my document uploaded during conversion?",
    answer:
      "No. Everything — reading the .docx and building the PDF — happens locally in your browser, so your file stays private.",
  },
];

export default function WordToPdfPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/pdf-tools" },
          { label: "Word to PDF" },
        ]}
        h1="Word to PDF — Convert DOCX in Your Browser"
        trustLine="Turn a Word document into a shareable PDF while keeping your formatting and privacy."
        application={{ name: "Word to PDF", description: metaDescription, path }}
        howItWorks={[
          {
            icon: Upload,
            title: "Upload a .docx",
            description:
              "Drop in your Word document — it's read entirely on your own device.",
          },
          {
            icon: FileText,
            title: "Formatting is preserved",
            description:
              "Headings, lists, tables, styling, and images are converted into a clean PDF layout.",
          },
          {
            icon: Download,
            title: "Download your PDF",
            description:
              "Save the finished PDF instantly — no watermark and no account required.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/pdf-to-word",
            label: "PDF to Word",
            description: "Extract editable text from a PDF.",
          },
          {
            href: "/tools/merge-pdf",
            label: "Merge PDF",
            description: "Combine the PDF with other files.",
          },
          {
            href: "/tools/compress-pdf",
            label: "Compress PDF",
            description: "Shrink the converted document.",
          },
          {
            href: "/tools/watermark-pdf",
            label: "Watermark PDF",
            description: "Add a stamp or logo to the PDF.",
          },
        ]}
        seoContent={<WordToPdfSeoContent />}
      >
        <WordToPdfWidget />
      </ToolPageTemplate>
    </>
  );
}

function WordToPdfSeoContent() {
  return (
    <div className="space-y-4 leading-relaxed text-neutral-600">
      <h2 className="text-xl font-semibold text-neutral-900">
        Share Word documents as reliable PDFs
      </h2>
      <p>
        PDF is the format people trust for sending finished documents. It looks the
        same on every device, can&rsquo;t be accidentally edited, and is accepted by
        virtually every portal and printer. Converting your Word file to PDF is the
        natural last step before submitting a resume, a report, or a signed form.
      </p>
      <p>
        This converter reads your .docx and reconstructs its content into a
        well-structured PDF. Headings stay bold and prominent, bullet and numbered
        lists keep their indentation, tables retain their grid, and embedded images
        travel along with the text. For the vast majority of everyday documents,
        the result is exactly what you&rsquo;d expect.
      </p>
      <p>
        In the interest of honesty: a browser can&rsquo;t match a full desktop copy of
        Word for pixel-perfect fidelity. Highly complex layouts, custom fonts, and
        features like running headers or footers may not survive the trip. For
        standard letters, essays, and reports, though, the output is clean and
        professional.
      </p>
      <p>
        Best of all, the conversion is completely private — your document is never
        uploaded. Once you have the PDF, you can merge it, compress it, or stamp it
        with a watermark using the related tools below.
      </p>
    </div>
  );
}
