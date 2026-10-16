import type { Metadata } from "next";

import { ToolCategoryPage } from "@/components/tools/ToolCategoryPage";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";
import { getToolsByCategory, toolsCatalog } from "@/lib/tools-catalog";

const path = "/image-tools";

export const metadata: Metadata = buildMetadata(
  "Free Image Tools – Resize, Compress & Convert to JPG",
  "Resize, compress, and convert images in your browser, plus turn images into PDFs and PDFs into images. Supported formats and limits for each tool.",
  path,
);

const pdfToJpg = toolsCatalog.filter(
  (tool) => tool.href === "/tools/pdf-to-jpg",
);

export default function ImageToolsPage() {
  return (
    <ToolCategoryPage
      path={path}
      label="Image Tools"
      h1="Image Tools"
      intro={
        <>
          <p>
            Resize photos to exact pixel dimensions, shrink file size for the
            web or email, convert other formats to JPG, and move between images
            and PDFs.
          </p>
          <p>
            Images are processed with your browser&rsquo;s built-in canvas, so
            they never leave your device.
          </p>
        </>
      }
      groups={[
        {
          heading: "Resize and compress",
          description:
            "Smaller dimensions and smaller files for websites, forms, and messaging apps.",
          tools: getToolsByCategory("image").filter((tool) =>
            ["/tools/resize-image", "/tools/compress-image"].includes(
              tool.href,
            ),
          ),
        },
        {
          heading: "Convert",
          description:
            "Change an image to JPG, or move between images and PDF documents.",
          tools: [
            ...getToolsByCategory("image").filter((tool) =>
              ["/tools/convert-to-jpg", "/tools/jpg-to-pdf"].includes(
                tool.href,
              ),
            ),
            ...pdfToJpg,
          ],
        },
      ]}
      workflows={[
        {
          title: "Prepare a photo for an upload form with a size limit",
          steps: [
            { href: "/tools/resize-image", label: "Resize Image" },
            { href: "/tools/compress-image", label: "Compress Image" },
          ],
          note: "Reducing the pixel dimensions first usually saves the most space.",
        },
        {
          title: "Use a WebP or PNG where only JPG is accepted",
          steps: [
            { href: "/tools/convert-to-jpg", label: "Convert to JPG" },
            { href: "/tools/compress-image", label: "Compress Image" },
          ],
          note: "Transparent areas become white when converting to JPG.",
        },
        {
          title: "Combine receipts or scans into one document",
          steps: [
            { href: "/tools/jpg-to-pdf", label: "JPG to PDF" },
            { href: "/tools/compress-pdf", label: "Compress PDF" },
          ],
          note: "Reorder images before creating the PDF; each image becomes one page.",
        },
        {
          title: "Get one page of a PDF as an image",
          steps: [
            { href: "/tools/split-pdf", label: "Split PDF" },
            { href: "/tools/pdf-to-jpg", label: "PDF to JPG" },
          ],
          note: "Or convert the whole PDF and keep only the page you need.",
        },
      ]}
    />
  );
}
