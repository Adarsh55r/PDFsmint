import type { Metadata } from "next";

import { ToolCategoryPage } from "@/components/tools/ToolCategoryPage";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";
import { getToolsByCategory, type ToolFacts } from "@/lib/tools-catalog";

const path = "/pdf-tools";

export const metadata: Metadata = buildMetadata(
  "Free PDF Tools – Compress, Merge, Split, Sign & Convert",
  "Every PDF tool on PDFsMint in one place, with supported formats and file limits. Compress, merge, split, sign, watermark, and convert PDFs in your browser.",
  path,
);

function pick(hrefs: string[]): ToolFacts[] {
  const tools = getToolsByCategory("pdf");
  return hrefs
    .map((href) => tools.find((tool) => tool.href === href))
    .filter((tool): tool is ToolFacts => Boolean(tool));
}

export default function PdfToolsPage() {
  return (
    <ToolCategoryPage
      path={path}
      label="PDF Tools"
      h1="PDF Tools"
      intro={
        <>
          <p>
            Free tools for the most common PDF jobs: making a file smaller,
            combining or separating documents, rearranging pages, signing, and
            converting to and from Word or images.
          </p>
          <p>
            Every tool runs in your browser. Files are not uploaded, and there
            is no account, watermark, or daily usage cap.
          </p>
        </>
      }
      groups={[
        {
          heading: "Reduce file size",
          description:
            "For email attachment limits and upload forms that reject large files.",
          tools: pick(["/tools/compress-pdf"]),
        },
        {
          heading: "Organize pages",
          description:
            "Combine documents, pull out the pages you need, or fix page order and rotation.",
          tools: pick([
            "/tools/merge-pdf",
            "/tools/split-pdf",
            "/tools/edit-pdf",
            "/tools/n-up-pdf",
          ]),
        },
        {
          heading: "Sign and mark",
          description:
            "Add a signature to a form or contract, or stamp pages with a watermark.",
          tools: pick(["/tools/sign-pdf", "/tools/watermark-pdf"]),
        },
        {
          heading: "Convert",
          description:
            "Move content between PDF, Word, and image formats. Each tool lists what it keeps and what it can't.",
          tools: pick([
            "/tools/pdf-to-word",
            "/tools/word-to-pdf",
            "/tools/pdf-to-jpg",
          ]),
        },
      ]}
      workflows={[
        {
          title: "Send several documents as one small attachment",
          steps: [
            { href: "/tools/merge-pdf", label: "Merge PDF" },
            { href: "/tools/compress-pdf", label: "Compress PDF" },
          ],
          note: "Merge first, then compress the combined file once.",
        },
        {
          title: "Remove pages before sharing",
          steps: [
            { href: "/tools/edit-pdf", label: "Edit PDF" },
            { href: "/tools/compress-pdf", label: "Compress PDF" },
          ],
          note: "Delete unneeded pages, then compress if the file is still too large.",
        },
        {
          title: "Sign and return a form",
          steps: [
            { href: "/tools/sign-pdf", label: "Sign PDF" },
            { href: "/tools/merge-pdf", label: "Merge PDF" },
          ],
          note: "Sign the form, then merge it with any supporting documents.",
        },
        {
          title: "Turn phone photos of paperwork into a PDF",
          steps: [
            { href: "/tools/jpg-to-pdf", label: "JPG to PDF" },
            { href: "/tools/compress-pdf", label: "Compress PDF" },
          ],
          note: "Photos make large PDFs; compressing afterwards usually helps a lot.",
        },
      ]}
    />
  );
}
