import type { MetadataRoute } from "next";

import { blogPostsBySlug } from "@/lib/blog-posts";
import { siteConfig } from "@/lib/seo-config";
import { getAllSitemapRoutes } from "@/lib/site-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = getAllSitemapRoutes();

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: path.startsWith("/blog/")
      ? new Date(
          blogPostsBySlug[path.replace("/blog/", "")]?.publishedAt ??
            new Date(),
        )
      : new Date(),
    changeFrequency,
    priority,
  }));
}
