import type { Metadata } from "next";
import { Lock, Zap } from "lucide-react";

import { HomeTrustStats } from "@/components/home/HomeTrustStats";
import { HomeValueProps } from "@/components/home/HomeValueProps";
import { ToolCard } from "@/components/home/ToolCard";
import { Container } from "@/components/layout/Container";
import { faqPageJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { ToolFaqSection } from "@/components/tools/ToolFaqSection";
import { toolCategories } from "@/lib/navigation";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const metaTitle = "Free Online PDF Tools — Compress, Merge & Convert";
const metaDescription =
  "Free online PDF & image tools that run in your browser. Compress, merge, split & convert — no signup, files never uploaded.";

export const metadata: Metadata = buildMetadata(
  metaTitle,
  metaDescription,
  "/",
);

const homeFaqs = [
  {
    question: "Are these PDF and image tools really free?",
    answer:
      "Yes. All tools on this site are free to use with no subscription or hidden fees. We don't add watermarks to your output files.",
  },
  {
    question: "Do you upload my files to a server?",
    answer:
      "No. Every tool processes files locally in your browser using JavaScript. Your documents never leave your device, which keeps sensitive files private.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required. Simply choose a tool, upload your file, and download the result — no email verification or login step.",
  },
  {
    question: "What file types do you support?",
    answer:
      "We support PDFs for merge, split, compress, convert, and edit workflows. Image tools accept common formats like JPG, PNG, and WebP. Each tool page lists its accepted formats.",
  },
  {
    question: "Does it work on mobile phones?",
    answer:
      "Yes, on modern mobile browsers. For very large files, a desktop browser is recommended because mobile devices have less available memory.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(homeFaqs)} />

      {/* Hero */}
      <section className="border-b border-neutral-200/80 bg-white">
        <Container className="py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-800">
              <Lock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              100% private — files stay on your device
            </p>
            <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Free Online PDF &amp; Image Tools — No Signup, No Limits, No
              Watermarks
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              Compress, merge, split, and convert files instantly in your
              browser. Nothing is uploaded to our servers —{" "}
              <span className="font-medium text-neutral-800">
                fast, free, and private
              </span>
              .
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-primary-600" strokeWidth={1.75} />
                Instant results
              </span>
              <span aria-hidden className="hidden sm:inline">
                ·
              </span>
              <span>No account required</span>
              <span aria-hidden className="hidden sm:inline">
                ·
              </span>
              <span>{siteConfig.name}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Tools grid — primary CTA */}
      <section
        id="tools"
        aria-labelledby="tools-section-heading"
        className="py-16 lg:py-20"
      >
        <Container>
          <div className="mb-12 text-center md:mb-14">
            <h2
              id="tools-section-heading"
              className="text-2xl font-semibold tracking-tight md:text-3xl"
            >
              Pick a tool to get started
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Select a tool below — your file is processed locally and never
              leaves your browser.
            </p>
          </div>

          {toolCategories.map((category, index) => (
            <div
              key={category.label}
              className={index > 0 ? "mt-14 md:mt-16" : undefined}
            >
              <h3 className="mb-6 flex items-center gap-3 text-lg font-semibold text-neutral-900">
                <span className="h-px flex-1 bg-neutral-200" aria-hidden />
                {category.label}
                <span className="h-px flex-1 bg-neutral-200" aria-hidden />
              </h3>
              <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {category.links.map((tool) => (
                  <li key={`${category.label}-${tool.href}`}>
                    <ToolCard tool={tool} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </section>

      <HomeValueProps />
      <HomeTrustStats />

      {/* Site-wide FAQ */}
      <section className="border-t border-neutral-200/80 bg-white py-16 lg:py-20">
        <Container size="narrow">
          <ToolFaqSection
            faqs={homeFaqs}
            className="mt-0"
            heading="Common questions"
          />
        </Container>
      </section>
    </>
  );
}
