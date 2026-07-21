import { blogPosts } from "@/lib/blog-posts";
import { popularTools } from "@/lib/navigation";

export type SitemapRoute = {
  path: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
};

const marketingRoutes: SitemapRoute[] = [
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
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  return [homepage, ...toolRoutes, ...marketingRoutes, ...blogRoutes];
}
