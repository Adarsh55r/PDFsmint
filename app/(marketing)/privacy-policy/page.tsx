import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const LAST_UPDATED = "July 20, 2026";
const CONTACT_EMAIL = siteConfig.contactEmail;

export const metadata: Metadata = buildMetadata(
  "Privacy Policy",
  `How ${siteConfig.name} protects your privacy: files are processed entirely in your browser and never uploaded or stored on our servers.`,
  "/privacy-policy",
);

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      description={`Last updated: ${LAST_UPDATED}`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
    >
      <div className="space-y-8 leading-relaxed text-neutral-700">
        <section className="space-y-3">
          <p>
            This Privacy Policy explains how {siteConfig.name} (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;, or &ldquo;our&rdquo;) handles information when you
            use our website and tools. Our guiding principle is simple: the files
            you work with are yours, and they should stay that way. We designed
            this service so that your documents are processed on your own device
            and are never sent to us.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Your files are never uploaded
          </h2>
          <p>
            Every tool on {siteConfig.name} — including compressing, merging,
            splitting, editing, watermarking, and converting PDFs and images —
            runs entirely inside your web browser using client-side JavaScript.
            When you select a file, it is read into your browser&rsquo;s memory,
            processed locally, and offered back to you as a download.
          </p>
          <p>
            At no point is your file transmitted to our servers, saved to a
            database, or shared with any third party. Because the processing is
            local, your documents remain private even when they contain sensitive
            information such as contracts, financial records, or personal
            identification.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Information we do and don&rsquo;t collect
          </h2>
          <p>
            We do <strong>not</strong> collect, store, or have access to the
            contents of any file you process, nor do we require you to create an
            account or provide personal details to use the tools.
          </p>
          <p>
            Like most websites, we may collect limited, non-identifying technical
            information automatically — such as browser type, device type,
            approximate region, and pages visited — to understand overall usage
            and keep the site reliable. This data is aggregated and cannot be used
            to identify you personally or to see your files.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Cookies and analytics
          </h2>
          <p>
            We use{" "}
            <a
              href="https://vercel.com/docs/analytics/privacy-policy"
              className="font-medium text-primary-800 underline-offset-2 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Vercel Web Analytics
            </a>{" "}
            to measure aggregated page views and traffic. It is designed to be
            privacy-friendly and does not use cookies for visitor tracking. If we
            add advertising cookies later (for example Google AdSense), those are
            described in the Advertising section below. You can block or delete
            cookies through your browser settings at any time; the core tools will
            continue to function without them.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Advertising
          </h2>
          <p>
            This website may display advertisements to help keep the tools free.
            If we use Google AdSense or a similar network, third-party vendors —
            including Google — may use cookies to serve ads based on your prior
            visits to this and other websites.
          </p>
          <p>
            Google&rsquo;s use of advertising cookies enables it and its partners
            to serve ads to you based on your visits to our site and other sites
            on the internet. You can opt out of personalized advertising by
            visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              className="font-medium text-primary-700 underline hover:text-primary-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            . For more choices about third-party advertising cookies, visit{" "}
            <a
              href="https://www.aboutads.info/choices/"
              className="font-medium text-primary-700 underline hover:text-primary-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              aboutads.info/choices
            </a>
            .
          </p>
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Note for the site owner: this advertising section assumes Google
            AdSense. Adjust it to match the ad network you are actually approved
            for, and add your Publisher ID where required.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Third-party links
          </h2>
          <p>
            Our site may contain links to external websites we do not operate. We
            are not responsible for the privacy practices of those sites, and we
            encourage you to review their policies before sharing any information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Children&rsquo;s privacy
          </h2>
          <p>
            Our services are intended for general audiences and are not directed
            at children under the age of 13. We do not knowingly collect personal
            information from children.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Your rights
          </h2>
          <p>
            Depending on where you live, you may have rights under regulations
            such as the GDPR or CCPA — including the right to access, correct, or
            delete personal data held about you. Since we do not collect your
            files or personal identifiers, most requests relate only to
            aggregated analytics. Contact us using the details below and we will
            respond in accordance with applicable law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Changes to this policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we
            will revise the &ldquo;Last updated&rdquo; date at the top of this
            page. Significant changes will be highlighted on the site where
            appropriate.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">Contact us</h2>
          <p>
            If you have any questions about this Privacy Policy or how your data
            is handled, please reach out at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-primary-700 underline hover:text-primary-800"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </PageShell>
  );
}
