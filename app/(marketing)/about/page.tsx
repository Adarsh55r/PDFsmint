import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ServerOff, Wallet, Zap } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

export const metadata: Metadata = buildMetadata(
  "About",
  `Learn about ${siteConfig.name} — a free suite of PDF and image tools that run entirely in your browser, so your files never leave your device.`,
  "/about",
);

const principles = [
  {
    icon: Lock,
    title: "Privacy by design",
    description:
      "Files are processed on your device, not ours. Nothing is uploaded, logged, or stored.",
  },
  {
    icon: Wallet,
    title: "Free, with no catch",
    description:
      "No trials, paywalls, or watermarks. Ads keep the lights on so the tools stay free.",
  },
  {
    icon: Zap,
    title: "Fast and frictionless",
    description:
      "No signups or installs. Open a tool and get your result in seconds.",
  },
  {
    icon: ServerOff,
    title: "No server round-trips",
    description:
      "Because work happens locally, there are no upload queues or size-based limits from us.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${siteConfig.name}`}
      description="Fast, private, browser-based file tools — built for people who value their privacy."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
    >
      <div className="space-y-10 leading-relaxed text-neutral-700">
        <section className="space-y-3">
          <p>
            {siteConfig.name} is a growing collection of free tools for working
            with PDF and image files — compressing, merging, splitting, editing,
            converting, and more. What makes us different is simple: everything
            runs inside your browser. Your files are never sent to a server,
            which means they stay completely private.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">
            Why we built this
          </h2>
          <p>
            Most online file tools ask you to upload sensitive documents to a
            remote server you know nothing about. For a quick task like shrinking
            a PDF or turning a few photos into one document, that&rsquo;s a lot of
            trust to hand over — and a real risk when the files contain contracts,
            IDs, or financial details.
          </p>
          <p>
            Modern browsers are powerful enough to do this work locally. We took
            advantage of that to build tools that are genuinely private: the file
            you choose is read into your browser&rsquo;s memory, processed on the
            spot, and handed straight back to you as a download. It never touches
            our infrastructure.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-xl font-semibold text-neutral-900">
            What we stand for
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-5"
                >
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary-700 shadow-soft">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mb-1.5 text-base font-semibold text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            How it stays free
          </h2>
          <p>
            Running a website has costs, so you may see unobtrusive ads on some
            pages. That advertising is what allows us to keep every tool free and
            unlimited. We will never charge for the core features or add
            watermarks to your files.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            Get in touch
          </h2>
          <p>
            Have feedback, a bug report, or an idea for a tool you&rsquo;d like to
            see? We&rsquo;d love to hear from you — visit our{" "}
            <Link
              href="/contact"
              className="font-medium text-primary-700 underline hover:text-primary-800"
            >
              contact page
            </Link>
            . You can also review how we protect your data in our{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-primary-700 underline hover:text-primary-800"
            >
              privacy policy
            </Link>
            .
          </p>
        </section>
      </div>
    </PageShell>
  );
}
