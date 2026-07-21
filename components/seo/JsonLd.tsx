import { resolveAbsoluteUrl, siteConfig } from "@/lib/seo-config";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export type SoftwareApplicationSchemaInput = {
  name: string;
  description: string;
  path: string;
};

export function softwareApplicationJsonLd({
  name,
  description,
  path,
}: SoftwareApplicationSchemaInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: resolveAbsoluteUrl(path),
    applicationCategory: "Utility",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export type BreadcrumbItemInput = {
  label: string;
  href?: string;
};

export function breadcrumbListJsonLd(
  items: BreadcrumbItemInput[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: resolveAbsoluteUrl(item.href) } : {}),
    })),
  };
}

export type FaqItem = {
  question: string;
  answer: string;
};

export function faqPageJsonLd(faqs: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
