import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { ContactForm } from "@/components/marketing/ContactForm";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const CONTACT_EMAIL = siteConfig.contactEmail;

export const metadata: Metadata = buildMetadata(
  "Contact",
  `Get in touch with ${siteConfig.name} — questions, feedback, bug reports, and tool suggestions are all welcome.`,
  "/contact",
);

export default function ContactPage() {
  return (
    <PageShell
      title="Contact us"
      description="Questions, feedback, or an idea for a new tool? Send us a note."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
    >
      <div className="space-y-8">
        <p className="leading-relaxed text-neutral-700">
          We read every message. Whether you&rsquo;ve found a bug, want to suggest
          a feature, or just have a question about how the tools work, use the
          form below or email us directly.
        </p>

        <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary-700 shadow-soft">
            <Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <p className="text-sm font-medium text-neutral-900">Email</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-primary-700 hover:text-primary-800"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <ContactForm />

        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Heads up: this contact form is a front-end demo and is not connected to
          a backend or email service yet. Update it with your form handler (or a
          service like Formspree) before launch.
        </p>
      </div>
    </PageShell>
  );
}
