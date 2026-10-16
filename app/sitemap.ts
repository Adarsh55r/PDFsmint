import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo-config";
import { getAllSitemapRoutes } from "@/lib/site-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllSitemapRoutes().map(
    ({ path, lastModified, priority, changeFrequency }) => ({
      url: `${siteConfig.url}${path}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency,
      priority,
    }),
  );
}
