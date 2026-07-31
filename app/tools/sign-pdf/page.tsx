import type { Metadata } from "next";
import { Download, PenLine, Upload } from "lucide-react";

import { SignPdfWidget } from "./SignPdfWidget";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const path = "/tools/sign-pdf";
const metaTitle = `Sign PDF Free Online – Draw, Type or Upload Signature | ${siteConfig.name}`;
const metaDescription =
  "Add a handwritten, typed, or uploaded signature to any PDF page in your browser. Drag, resize, and download — no account, nothing uploaded.";

export const metadata: Metadata = buildMetadata(
  metaTitle,
  metaDescription,
  path,
);

const faqs = [
  {
    question: "How do I sign a PDF online for free?",
    answer:
      "Upload your PDF, create a signature by drawing, typing your name, or uploading an image, then place it on any page. Download the signed file when you are done — no account required.",
  },
  {
    question: "Can I place signatures on multiple pages?",
    answer:
      "Yes. After you create a signature, click each page (or use Place signature here) to add as many copies as you need. You can also add today's date as a separate stamp next to a signature.",
  },
  {
    question: "Is my signed PDF uploaded to a server?",
    answer:
      "No. Page previews, signature drawing, and embedding all run in your browser with pdf.js and pdf-lib. Your document never leaves your device.",
  },
  {
    question: "Does it work on phones and tablets?",
    answer:
      "Yes. Drawing uses a touch-friendly signature pad, and you can drag or resize placements with a finger. Large documents may be slower on smaller devices.",
  },
  {
    question: "What if my PDF is password-protected?",
    answer:
      "Password-protected PDFs cannot be signed here. Remove the password with another tool first, then open the unlocked file in Sign PDF.",
  },
];

export default function SignPdfPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <ToolPageTemplate
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "PDF Tools", href: "/" },
          { label: "Sign PDF" },
        ]}
        h1="Sign PDF — Draw, Type, or Upload a Signature"
        trustLine="Place e-signatures and dates on any page entirely in your browser — nothing is uploaded."
        application={{
          name: "Sign PDF",
          description: metaDescription,
          path,
        }}
        howItWorks={[
          {
            icon: Upload,
            title: "Open your PDF",
            description:
              "Drop in a contract or form (up to 50 MB). Pages render locally for placement.",
          },
          {
            icon: PenLine,
            title: "Create & place a signature",
            description:
              "Draw, type in a cursive font, or upload an image. Drag it onto pages and resize as needed.",
          },
          {
            icon: Download,
            title: "Download the signed file",
            description:
              "We embed your stamps into a new PDF with pdf-lib and save it on your device.",
          },
        ]}
        faqs={faqs}
        relatedTools={[
          {
            href: "/tools/edit-pdf",
            label: "Edit PDF",
            description: "Reorder, rotate, or remove pages first.",
          },
          {
            href: "/tools/watermark-pdf",
            label: "Watermark PDF",
            description: "Stamp text or a logo across pages.",
          },
          {
            href: "/tools/merge-pdf",
            label: "Merge PDF",
            description: "Combine signed files into one packet.",
          },
          {
            href: "/tools/compress-pdf",
            label: "Compress PDF",
            description: "Shrink the file after signing.",
          },
        ]}
        seoContent={<SignPdfSeoContent />}
      >
        <SignPdfWidget />
      </ToolPageTemplate>
    </>
  );
}

function SignPdfSeoContent() {
  return (
    <div className="space-y-4 text-neutral-600 leading-relaxed">
      <h2 className="text-xl font-semibold text-neutral-900">
        Sign PDF documents without an account or upload
      </h2>
      <p>
        Contracts, permission slips, and forms often need a quick signature — not
        a full e-sign platform with logins and cloud storage. This Sign PDF tool
        keeps the workflow local: open the file in your browser, create a
        signature once, place it wherever you need it, and download a new PDF
        with the stamps embedded.
      </p>
      <p>
        You can draw with a mouse or finger, type your name in a cursive font, or
        upload an existing signature image. The same signature can be reused on
        multiple pages (for example, a full signature on page one and initials
        elsewhere). Adding today&apos;s date as a separate stamp mirrors the
        common pattern of signing and dating a printed page.
      </p>
      <p>
        Placement previews are rendered with Mozilla&apos;s pdf.js; the final
        file is written with pdf-lib so the signature becomes part of the PDF
        itself. Because everything stays on your device, sensitive agreements
        are never sent to our servers — the same privacy model as the rest of{" "}
        {siteConfig.name}.
      </p>
      <p>
        For best results, use a clear signature on a transparent PNG when
        uploading, and place stamps on a blank margin so they stay readable when
        printed. If a PDF is encrypted, unlock it first — password-protected
        files cannot be modified in the browser.
      </p>
    </div>
  );
}
