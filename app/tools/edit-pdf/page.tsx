import type { Metadata } from "next";
import { Download, PenLine, Upload } from "lucide-react";

import { EditPdfWidget } from "./EditPdfWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const path = "/tools/edit-pdf";
const metaTitle = `Edit PDF Free – Reorder, Rotate & Delete Pages | ${siteConfig.name}`;
const metaDescription =
  "Rearrange, rotate, and remove PDF pages visually in your browser. See page thumbnails, edit, and save — private, free, and no signup.";

export const metadata: Metadata = buildMetadata(metaTitle, metaDescription, path);

const faqs = [
  {
    question: "What can I change with this editor?",
    answer:
      "You can reorder pages, rotate them in 90-degree steps, and delete the ones you don't need. It's page-level editing — ideal for tidying up a document's structure.",
  },
  {
    question: "Can I edit the text inside the PDF?",
    answer:
      "Not with this tool. It focuses on organising pages. To change wording, convert the PDF to Word, edit the text, and export it back to PDF.",
  },
  {
    question: "Does rotating a page reduce its quality?",
    answer:
      "No. Rotation is stored as a page property, and pages are copied without re-rendering, so text and images stay perfectly sharp.",
  },
  {
    question: "How do the thumbnails help?",
    answer:
      "Each page is shown as a small preview so you can see what you're moving, turning, or removing before you commit to saving the new file.",
  },
  {
    question: "Is my PDF uploaded while I edit it?",
    answer:
      "No. Previews are generated and the final file is assembled locally in your browser, so the document never leaves your device.",
  },
];

export default function EditPdfPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/" },
          { label: "Edit PDF" },
        ]}
        h1="Edit PDF — Reorder, Rotate & Remove Pages"
        trustLine="Organise your PDF visually with page thumbnails, all inside your browser."
        application={{ name: "Edit PDF", description: metaDescription, path }}
        howItWorks={[
          {
            icon: Upload,
            title: "Open your PDF",
            description:
              "Drop in a document and we'll render a thumbnail for every page.",
          },
          {
            icon: PenLine,
            title: "Rearrange and adjust",
            description:
              "Move pages left or right, rotate them, or delete the ones you don't want.",
          },
          {
            icon: Download,
            title: "Save the new PDF",
            description:
              "Apply your changes and download a freshly assembled document instantly.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/merge-pdf",
            label: "Merge PDF",
            description: "Combine several PDFs into one.",
          },
          {
            href: "/tools/split-pdf",
            label: "Split PDF",
            description: "Break a PDF into separate files.",
          },
          {
            href: "/tools/watermark-pdf",
            label: "Watermark PDF",
            description: "Stamp text or a logo on pages.",
          },
          {
            href: "/tools/compress-pdf",
            label: "Compress PDF",
            description: "Shrink your edited document.",
          },
        ]}
        seoContent={<EditPdfSeoContent />}
      >
        <EditPdfWidget />
      </ToolPageTemplate>
    </>
  );
}

function EditPdfSeoContent() {
  return (
    <div className="space-y-4 leading-relaxed text-neutral-600">
      <h2 className="text-xl font-semibold text-neutral-900">
        Tidy up your PDF, one page at a time
      </h2>
      <p>
        Documents rarely come out perfectly ordered. A scanner might flip a page
        sideways, a chapter might land in the wrong spot, or you may simply want to
        drop a blank cover sheet. This visual editor lets you fix all of that
        without any specialised software.
      </p>
      <p>
        Every page appears as a thumbnail, so you always know exactly what you&rsquo;re
        working with. Use the arrows to shuffle pages into the right sequence, tap
        rotate to turn a sideways scan upright, and remove anything that shouldn&rsquo;t
        be there. Your changes are previewed live before you save.
      </p>
      <p>
        When you save, the pages are copied into a brand-new PDF rather than
        re-rendered, which means the text remains selectable and the quality is
        untouched. Rotations are written as native page properties, exactly how a
        professional PDF editor would handle them.
      </p>
      <p>
        The whole workflow happens in your browser, keeping sensitive material
        private. After editing, you can merge the result with other files, split it
        apart again, or compress it — all linked below.
      </p>
    </div>
  );
}
