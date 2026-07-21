import type { Metadata } from "next";
import { Download, Ruler, Upload } from "lucide-react";

import { ResizeImageWidget } from "./ResizeImageWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const path = "/tools/resize-image";
const metaTitle = `Resize Image Online Free – Set Exact Width & Height | ${siteConfig.name}`;
const metaDescription =
  "Change any image's dimensions by pixels in your browser. Lock the aspect ratio, export JPG/PNG/WebP, and keep your photos private.";

export const metadata: Metadata = buildMetadata(metaTitle, metaDescription, path);

const faqs = [
  {
    question: "Can I keep the image from looking stretched?",
    answer:
      "Yes. Leave the aspect-ratio lock on and the second dimension updates automatically whenever you change the first, so proportions stay correct.",
  },
  {
    question: "Which output formats are available?",
    answer:
      "You can save the resized image as JPG, PNG, or WebP. JPG suits photos, PNG preserves transparency and sharp edges, and WebP balances both.",
  },
  {
    question: "Does resizing reduce quality?",
    answer:
      "Scaling down is generally clean and crisp. Enlarging beyond the original size can look soft, since the browser has to invent pixels that weren't there.",
  },
  {
    question: "Is there a limit on image size?",
    answer:
      "Files up to 30 MB are supported. Extremely large dimensions may hit browser memory limits, especially on mobile devices.",
  },
  {
    question: "Are my images uploaded to resize them?",
    answer:
      "No. Resizing is handled entirely by your browser's Canvas engine, so your pictures never leave your device.",
  },
];

export default function ResizeImagePage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Image Tools", href: "/" },
          { label: "Resize Image" },
        ]}
        h1="Resize Image — Exact Pixel Dimensions"
        trustLine="Set a precise width and height for any image, right inside your browser."
        application={{ name: "Resize Image", description: metaDescription, path }}
        howItWorks={[
          {
            icon: Upload,
            title: "Add an image",
            description:
              "Drop in a JPG, PNG, or WebP. We instantly read its current dimensions for you.",
          },
          {
            icon: Ruler,
            title: "Enter new size",
            description:
              "Type the width or height you need. Keep the ratio locked to avoid distortion, or unlock it for a custom shape.",
          },
          {
            icon: Download,
            title: "Download the result",
            description:
              "Export in your chosen format and save the resized image immediately.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/compress-image",
            label: "Compress Image",
            description: "Reduce the file size after resizing.",
          },
          {
            href: "/tools/convert-to-jpg",
            label: "Convert to JPG",
            description: "Turn PNG or WebP files into JPG.",
          },
          {
            href: "/tools/jpg-to-pdf",
            label: "JPG to PDF",
            description: "Place resized images into a PDF.",
          },
          {
            href: "/tools/pdf-to-jpg",
            label: "PDF to JPG",
            description: "Export PDF pages as images.",
          },
        ]}
        seoContent={<ResizeImageSeoContent />}
      >
        <ResizeImageWidget />
      </ToolPageTemplate>
    </>
  );
}

function ResizeImageSeoContent() {
  return (
    <div className="space-y-4 leading-relaxed text-neutral-600">
      <h2 className="text-xl font-semibold text-neutral-900">
        Get your images to the perfect size
      </h2>
      <p>
        Different platforms want different dimensions — a profile photo, a product
        thumbnail, a banner, an email signature. Resizing lets you hit those exact
        pixel targets so an image fits its slot without awkward cropping or blurry
        upscaling by the platform itself.
      </p>
      <p>
        The tool reads your image&rsquo;s original width and height the moment you add
        it, then lets you type new values. With the aspect-ratio lock enabled, the
        opposite dimension follows automatically, so your photo never looks
        squashed. Prefer full control? Unlock it and set both numbers
        independently.
      </p>
      <p>
        You can also choose the output format. JPG keeps photographs small, PNG
        protects transparency and crisp graphics, and WebP offers modern
        compression that works well for the web. Everything is rendered locally
        with the Canvas API, so no image ever leaves your browser.
      </p>
      <p>
        Once resized, you might want to compress the file further for faster
        loading, or convert it to another format. The related tools below handle
        those next steps in the same private, in-browser way.
      </p>
    </div>
  );
}
