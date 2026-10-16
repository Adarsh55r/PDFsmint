import { blogPosts } from "@/lib/blog-posts";
import { popularTools } from "@/lib/navigation";

export type SitemapRoute = {
  path: string;
  /**
   * Only set when we know when the content really changed. A lastmod that
   * moves on every deploy teaches search engines to ignore it.
   */
  lastModified?: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
};

const marketingRoutes: SitemapRoute[] = [
  { path: "/pdf-tools", priority: 0.8, changeFrequency: "monthly" },
  { path: "/image-tools", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.5, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.5, changeFrequency: "yearly" },
];

export function getAllSitemapRoutes(): SitemapRoute[] {
  const homepage: SitemapRoute = {
    path: "",
    priority: 1.0,
    changeFrequency: "weekly",
  };

  const toolRoutes: SitemapRoute[] = popularTools.map((tool) => ({
    path: tool.href,
    priority: 0.9,
    changeFrequency: "weekly" as const,
  }));

  const blogRoutes: SitemapRoute[] = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  const latestPostDate = blogRoutes
    .map((route) => route.lastModified ?? "")
    .sort()
    .at(-1);
  const blogIndex: SitemapRoute = {
    path: "/blog",
    lastModified: latestPostDate,
    priority: 0.7,
    changeFrequency: "weekly",
  };

  return [homepage, ...toolRoutes, ...marketingRoutes, blogIndex, ...blogRoutes];
}
