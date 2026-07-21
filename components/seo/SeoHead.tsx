import { JsonLd } from "./JsonLd";
import { generateMetadata as buildMetadata, siteConfig } from "@/lib/seo-config";

type SeoHeadProps = {
  title?: string;
  description?: string;
  path?: string;
};

/** Optional legacy helper — prefer `generateMetadata` in page files and `Breadcrumbs` for structured data. */
export function SeoHead({ title, description, path = "" }: SeoHeadProps) {
  const pageMeta = buildMetadata(
    title ?? siteConfig.name,
    description ?? siteConfig.description,
    path,
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageMeta.title,
    description: pageMeta.description,
    url: `${siteConfig.url}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return <JsonLd data={structuredData} />;
}
