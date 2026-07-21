import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

const LAST_UPDATED = "July 20, 2026";

// TODO(REQUIRED BEFORE LAUNCH): set the jurisdiction whose laws govern these
// terms (e.g. "the State of Delaware, USA" or "England and Wales").
const GOVERNING_LAW = "[INSERT YOUR JURISDICTION]";

export const metadata: Metadata = buildMetadata(
  "Terms of Service",
  `The terms for using ${siteConfig.name}, a free suite of browser-based PDF and image tools that process your files locally on your device.`,
  "/terms",
);

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of Service"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
    >
      <div className="space-y-8 leading-relaxed text-neutral-700">
        <p className="text-sm text-neutral-500">Last updated: {LAST_UPDATED}</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            1. Acceptance of these terms
          </h2>
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of{" "}
            {siteConfig.name} (the &ldquo;Service&rdquo;), available at{" "}
            {siteConfig.url}. By accessing or using the Service, you agree to be
            bound by these Terms. If you do not agree with any part of them,
            please do not use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            2. What {siteConfig.name} is
          </h2>
          <p>
            {siteConfig.name} is a free collection of online tools for working
            with PDF and image files — including compressing, merging, splitting,
            converting, editing, and watermarking. All processing happens{" "}
            <strong>locally in your web browser</strong>, on your own device. We
            do not require an account, we do not upload your files to a server,
            and we do not store the files you process. Because the tools run
            entirely on your device, their performance depends on your browser,
            hardware, and the size and complexity of your files.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            3. No account required
          </h2>
          <p>
            The Service does not use accounts, logins, or profiles. You are
            responsible for the security of the device and browser you use to
            access the Service, and for saving any output files you generate to a
            location of your choosing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            4. Your files and your responsibilities
          </h2>
          <p>You are solely responsible for the files you process and agree that:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              You own the files, or otherwise have all rights and permissions
              needed to process them.
            </li>
            <li>
              You will keep your own backups. Because files are never uploaded, we
              cannot recover, restore, or retrieve anything you process.
            </li>
            <li>
              You are responsible for verifying that any output file meets your
              needs before relying on it.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            5. Acceptable use
          </h2>
          <p>You agree that you will not use the Service to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              process, create, or distribute content that is illegal, infringes
              intellectual property rights, or violates the rights of others;
            </li>
            <li>
              handle material you are not legally permitted to possess or modify;
            </li>
            <li>
              attempt to disrupt, overload, reverse engineer, or gain
              unauthorized access to the Service or the systems that host it;
            </li>
            <li>
              circumvent, disable, or interfere with security or usage
              limitations built into the tools.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            6. Disclaimer of warranties
          </h2>
          <p>
            The Service is provided free of charge, on an &ldquo;as is&rdquo; and
            &ldquo;as available&rdquo; basis, without warranties of any kind,
            whether express or implied, including but not limited to implied
            warranties of merchantability, fitness for a particular purpose, and
            non-infringement. We do not warrant that the Service will be
            uninterrupted, error-free, or that any output will be accurate,
            complete, or suitable for a given purpose.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            7. Limitation of liability
          </h2>
          <p>
            To the fullest extent permitted by law, {siteConfig.name} and its
            operators will not be liable for any indirect, incidental, special,
            consequential, or exemplary damages, or for any loss of data, files,
            profits, or goodwill, arising out of or related to your use of (or
            inability to use) the Service — even if advised of the possibility of
            such damages. Because the Service is provided free of charge, your
            sole remedy for dissatisfaction is to stop using it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            8. Third-party links and advertising
          </h2>
          <p>
            The Service may contain links to third-party websites or display
            third-party advertising. We are not responsible for the content,
            policies, or practices of any third party. Your interactions with
            third parties are solely between you and that third party.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            9. Changes to the Service and these Terms
          </h2>
          <p>
            We may add, change, or remove tools and features at any time, and we
            may update these Terms from time to time. When we do, we will revise
            the &ldquo;Last updated&rdquo; date above. Your continued use of the
            Service after changes take effect constitutes acceptance of the
            updated Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            10. Governing law
          </h2>
          <p>
            These Terms are governed by and construed in accordance with the laws
            of {GOVERNING_LAW}, without regard to its conflict-of-laws
            principles.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">11. Contact</h2>
          <p>
            Questions about these Terms? Please reach out through our{" "}
            <Link
              href="/contact"
              className="text-primary-700 underline hover:text-primary-800"
            >
              contact page
            </Link>
            . You may also want to review our{" "}
            <Link
              href="/privacy-policy"
              className="text-primary-700 underline hover:text-primary-800"
            >
              Privacy Policy
            </Link>
            , which explains how your files and data are handled.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
