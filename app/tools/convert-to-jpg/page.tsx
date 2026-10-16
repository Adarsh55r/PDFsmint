import type { Metadata } from "next";
import { Download, RefreshCcw, Upload } from "lucide-react";

import { ConvertToJpgWidget } from "./ConvertToJpgWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";

const path = "/tools/convert-to-jpg";
const metaTitle = `Convert to JPG Free – PNG, WebP & GIF to JPG`;
const metaDescription =
  "Convert PNG, WebP, GIF, or BMP images to JPG in your browser. Transparency is flattened to white, quality is adjustable — 100% private.";

export const metadata: Metadata = buildMetadata(metaTitle, metaDescription, path);

const faqs = [
  {
    question: "Which formats can I convert to JPG?",
    answer:
      "PNG, WebP, GIF, and BMP are all supported. Any image your browser can display can be turned into a standard JPG file.",
  },
  {
    question: "What happens to transparent areas?",
    answer:
      "JPG doesn't support transparency, so see-through pixels are placed on a white background. The rest of the image stays exactly as it was.",
  },
  {
    question: "Why convert an image to JPG at all?",
    answer:
      "JPG is universally supported and usually much smaller than PNG for photos, making it ideal for email, uploads, and older systems that reject newer formats.",
  },
  {
    question: "Can I control the output quality?",
    answer:
      "Yes. The quality slider lets you keep near-original fidelity or trade a little detail for a smaller file, depending on your needs.",
  },
  {
    question: "Is my image uploaded during conversion?",
    answer:
      "No. The conversion is performed locally by your browser, so the file never travels to a server or gets stored online.",
  },
];

export default function ConvertToJpgPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Image Tools", href: "/image-tools" },
          { label: "Convert to JPG" },
        ]}
        h1="Convert to JPG — PNG, WebP, GIF & More"
        trustLine="Change images from other formats into universal JPG files, entirely in your browser."
        application={{ name: "Convert to JPG", description: metaDescription, path }}
        howItWorks={[
          {
            icon: Upload,
            title: "Choose an image",
            description:
              "Drop in a PNG, WebP, GIF, or BMP file you'd like as a JPG.",
          },
          {
            icon: RefreshCcw,
            title: "Set the quality",
            description:
              "Pick how much detail to keep. Transparent areas are flattened onto white automatically.",
          },
          {
            icon: Download,
            title: "Download your JPG",
            description:
              "Save the converted image instantly — no watermark, no signup.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/compress-image",
            label: "Compress Image",
            description: "Make the JPG even smaller.",
          },
          {
            href: "/tools/resize-image",
            label: "Resize Image",
            description: "Change the image dimensions.",
          },
          {
            href: "/tools/jpg-to-pdf",
            label: "JPG to PDF",
            description: "Turn the JPG into a PDF page.",
          },
          {
            href: "/tools/pdf-to-jpg",
            label: "PDF to JPG",
            description: "Export PDF pages as JPG images.",
          },
        ]}
        seoContent={<ConvertToJpgSeoContent />}
      >
        <ConvertToJpgWidget />
      </ToolPageTemplate>
    </>
  );
}

function ConvertToJpgSeoContent() {
  return (
    <div className="space-y-4 leading-relaxed text-neutral-600">
      <h2 className="text-xl font-semibold text-neutral-900">
        Turn any picture into a universal JPG
      </h2>
      <p>
        JPG remains the most widely accepted image format on the planet. Some
        upload forms reject PNG or the newer WebP, older devices struggle with
        modern codecs, and photo prints almost always expect JPG. Converting to
        JPG sidesteps all of those compatibility headaches in one step.
      </p>
      <p>
        This tool decodes your source image — whether it&rsquo;s a transparent PNG, an
        animated GIF&rsquo;s first frame, a WebP, or a BMP — and re-encodes it as a clean
        JPG. Because JPG can&rsquo;t store transparency, any see-through regions are
        placed on a white background so nothing turns black or disappears.
      </p>
      <p>
        You control the output quality with a simple slider, letting you keep the
        image looking pristine or shave the file size down for quicker sharing. And
        since the conversion happens right in your browser, your images stay
        private from beginning to end.
      </p>
      <p>
        After converting, you can compress the JPG further, resize it to fit a
        specific spot, or drop it into a PDF. Those follow-up tools are linked
        below.
      </p>
    </div>
  );
}
