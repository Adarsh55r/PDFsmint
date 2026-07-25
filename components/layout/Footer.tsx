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
    <footer className="mt-auto relative overflow-hidden bg-primary-900 text-primary-50">
      {/* Soft brand atmosphere — not loud, just depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(45,212,191,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(13,148,136,0.22),_transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent"
      />

      <Container className="relative py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo
              idSuffix="footer"
              variant="light"
              markClassName="h-8 w-8"
              textClassName="text-lg"
              className="focus-visible:ring-offset-primary-900"
            />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-100/85">
              {siteConfig.description}
            </p>
            <p className="mt-4 text-sm font-medium text-primary-50">
              Fast tools. Zero uploads. Your files stay on your device.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">
              Popular Tools
            </h2>
            <ul className="mt-4 space-y-2.5">
              {popularTools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-sm text-primary-100/80 transition-colors hover:text-white"
                  >
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-100/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">
              Connect
            </h2>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="mt-4 inline-block text-sm text-primary-100/90 transition-colors hover:text-white"
            >
              {siteConfig.contactEmail}
            </a>
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.icon];

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary-700/80 bg-primary-800/60 text-primary-100 transition-all hover:border-primary-400/60 hover:bg-primary-700 hover:text-white"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </a>
                );
              })}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-primary-200/70">
              Social links are placeholders — update before launch.
            </p>
          </div>
        </div>

        <div
          id="footer-ad-slot"
          className="mt-10 flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-primary-600/50 bg-primary-950/35 px-4 py-6 text-center"
          aria-label="Advertisement placeholder"
        >
          <p className="text-xs text-primary-200/75">
            Ad placement reserved — Google AdSense slot
          </p>
        </div>
      </Container>

      <div className="relative border-t border-primary-800/80 bg-primary-950/50">
        <Container className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-primary-200/75">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-primary-100/80">
            Made with care — no data ever stored.
          </p>
        </Container>
      </div>
    </footer>
  );
}
