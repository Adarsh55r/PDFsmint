import Link from "next/link";
import { Code2, Globe, Share2 } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { BrandLogo } from "@/components/layout/Logo";
import {
  companyLinks,
  popularTools,
  socialLinks,
} from "@/lib/navigation";
import { siteConfig } from "@/lib/seo-config";

const socialIconMap = {
  twitter: Share2,
  github: Code2,
  linkedin: Globe,
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo idSuffix="footer" markClassName="h-8 w-8" textClassName="text-lg" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-600">
              {siteConfig.description}
            </p>
            <p className="mt-4 text-sm font-medium text-neutral-800">
              Fast tools. Zero uploads. Your files stay on your device.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              Popular Tools
            </h2>
            <ul className="mt-4 space-y-3">
              {popularTools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-sm text-neutral-600 transition-colors hover:text-primary-700"
                  >
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Company</h2>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 transition-colors hover:text-primary-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Connect</h2>
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.icon];

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all hover:border-neutral-300 hover:bg-white hover:text-neutral-900 hover:shadow-soft"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </a>
                );
              })}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-neutral-500">
              Social links are placeholders — update before launch.
            </p>
          </div>
        </div>

        <div
          id="footer-ad-slot"
          className="mt-10 flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/80 px-4 py-6 text-center"
          aria-label="Advertisement placeholder"
        >
          <p className="text-xs text-neutral-500">
            Ad placement reserved — Google AdSense slot
          </p>
        </div>
      </Container>

      <div className="border-t border-neutral-100 bg-neutral-50/80">
        <Container className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-neutral-600">
            Made with care — no data ever stored.
          </p>
        </Container>
      </div>
    </footer>
  );
}
