import type { Metadata } from "next";
import { Download, SlidersHorizontal, Upload } from "lucide-react";

import { CompressImageWidget } from "./CompressImageWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const path = "/tools/compress-image";
const metaTitle = `Compress Image Online Free – Shrink JPG & PNG | ${siteConfig.name}`;
const metaDescription =
  "Reduce photo file size in your browser with an adjustable quality slider. See before-and-after sizes instantly — private and free.";

export const metadata: Metadata = buildMetadata(metaTitle, metaDescription, path);

const faqs = [
  {
    question: "How much smaller will my image get?",
    answer:
      "It depends on the photo and the quality you pick. Detailed photographs often drop 60–80% in size at moderate quality with little visible difference.",
  },
  {
    question: "What does the quality slider actually do?",
    answer:
      "It sets the JPEG encoding level. Higher keeps more detail and a larger file; lower squeezes the file down at the cost of some fine detail.",
  },
  {
    question: "Can I compress PNG files too?",
    answer:
      "Yes. PNGs are re-encoded as high-quality JPGs, which usually delivers dramatic savings for photo-style images. Keep PNG if you need transparency.",
  },
  {
    question: "Will compressing change the dimensions?",
    answer:
      "No — the width and height stay the same. If you also want smaller dimensions, use the resize tool before or after compressing.",
  },
  {
    question: "Do you upload my photos to compress them?",
    answer:
      "No. Compression runs on your own device using the browser's Canvas engine, so your images are never sent anywhere.",
  },
];

export default function CompressImagePage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Image Tools", href: "/" },
          { label: "Compress Image" },
        ]}
        h1="Compress Image — Smaller Files, Same Look"
        trustLine="Reduce the size of your photos with a live quality slider, all in your browser."
        application={{ name: "Compress Image", description: metaDescription, path }}
        howItWorks={[
          {
            icon: Upload,
            title: "Add a photo",
            description:
              "Drop in a JPG, PNG, or WebP image you want to slim down.",
          },
          {
            icon: SlidersHorizontal,
            title: "Set the quality",
            description:
              "Slide to balance file size against detail. A mid-range setting suits most photos.",
          },
          {
            icon: Download,
            title: "Save the smaller file",
            description:
              "Compare the before-and-after sizes, then download your compressed image.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/resize-image",
            label: "Resize Image",
            description: "Change the pixel dimensions too.",
          },
          {
            href: "/tools/convert-to-jpg",
            label: "Convert to JPG",
            description: "Turn other formats into JPG.",
          },
          {
            href: "/tools/compress-pdf",
            label: "Compress PDF",
            description: "Shrink PDF documents as well.",
          },
          {
            href: "/tools/jpg-to-pdf",
            label: "JPG to PDF",
            description: "Bundle images into a PDF.",
          },
        ]}
        seoContent={<CompressImageSeoContent />}
      >
        <CompressImageWidget />
      </ToolPageTemplate>
    </>
  );
}

function CompressImageSeoContent() {
  return (
    <div className="space-y-4 leading-relaxed text-neutral-600">
      <h2 className="text-xl font-semibold text-neutral-900">
        Lighten your images for faster sharing
      </h2>
      <p>
        Large image files slow down websites, clog inboxes, and eat through
        storage. Compressing a photo trims away data your eyes barely notice,
        producing a much smaller file that still looks great. It&rsquo;s one of the
        easiest ways to speed up a page or squeeze under an upload limit.
      </p>
      <p>
        The quality slider puts you in charge of the trade-off. Toward the top you
        keep almost all the detail with modest savings; toward the middle you get
        big reductions that are usually invisible in everyday photos; near the
        bottom you get the smallest possible file for thumbnails or previews.
      </p>
      <p>
        A clear before-and-after summary shows exactly how many bytes you saved, so
        you can dial in the right setting with confidence. Because the work happens
        in your browser, even private or sensitive images stay entirely on your
        device.
      </p>
      <p>
        Pair compression with resizing when you need both smaller files and smaller
        dimensions, or convert between formats first. The related tools below make
        that easy.
      </p>
    </div>
  );
}
