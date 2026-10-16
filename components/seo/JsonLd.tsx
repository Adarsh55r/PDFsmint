import { resolveAbsoluteUrl, siteConfig } from "@/lib/seo-config";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so a value containing "</script>" can't end the tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
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
    "@type": "WebApplication",
    name,
    description,
    url: resolveAbsoluteUrl(path),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: { "@id": organizationId },
  };
}

/** Stable @id so every page's schema refers to the same Organization node. */
export const organizationId = `${siteConfig.url}/#organization`;

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: resolveAbsoluteUrl("/icons/favicon.svg"),
    email: siteConfig.contactEmail,
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

export type ArticleSchemaInput = {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
};

export function articleJsonLd({
  title,
  description,
  path,
  publishedAt,
  updatedAt,
}: ArticleSchemaInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: resolveAbsoluteUrl(path),
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    image: resolveAbsoluteUrl(siteConfig.ogImage),
    author: { "@id": organizationId },
    publisher: { "@id": organizationId },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": resolveAbsoluteUrl(path),
    },
  };
}
