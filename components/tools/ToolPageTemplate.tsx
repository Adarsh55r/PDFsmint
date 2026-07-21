import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/Container";
import {
  JsonLd,
  softwareApplicationJsonLd,
  type FaqItem,
} from "@/components/seo/JsonLd";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { HowItWorksSection } from "@/components/tools/HowItWorksSection";
import { RelatedToolsSection } from "@/components/tools/RelatedToolsSection";
import { ToolFaqSection } from "@/components/tools/ToolFaqSection";

export type HowItWorksStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type RelatedToolLink = {
  href: string;
  label: string;
  description: string;
};

type ToolPageTemplateProps = {
  breadcrumbs: BreadcrumbItem[];
  h1: string;
  trustLine: string;
  application: {
    name: string;
    description: string;
    path: string;
  };
  howItWorks: HowItWorksStep[];
  faqs: FaqItem[];
  relatedTools: RelatedToolLink[];
  seoContent: React.ReactNode;
  children: React.ReactNode;
};

export function ToolPageTemplate({
  breadcrumbs,
  h1,
  trustLine,
  application,
  howItWorks,
  faqs,
  relatedTools,
  seoContent,
  children,
}: ToolPageTemplateProps) {
  return (
    <>
      <JsonLd
        data={softwareApplicationJsonLd({
          name: application.name,
          description: application.description,
          path: application.path,
        })}
      />
      <Container size="narrow" className="py-16 lg:py-20">
        <Breadcrumbs items={breadcrumbs} />

        <header className="mb-10">
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            {h1}
          </h1>
          <p className="text-base text-muted md:text-lg">{trustLine}</p>
        </header>

        <section aria-label="Tool" className="mb-16">
          <div className="surface-card p-6 md:p-8">{children}</div>
        </section>

        <HowItWorksSection steps={howItWorks} />
        <article className="prose prose-neutral mt-16 max-w-none">
          {seoContent}
        </article>
        <ToolFaqSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </Container>
    </>
  );
}
