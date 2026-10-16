import { blogPosts } from "@/lib/blog-posts";
import { siteConfig } from "@/lib/seo-config";
import { toolCategoryPages, toolsCatalog } from "@/lib/tools-catalog";

export const dynamic = "force-static";

/**
 * Plain-text site summary following the llms.txt proposal (llmstxt.org).
 * There is no guarantee any AI system reads it; it's generated from the same
 * catalog as the tool pages, so keeping it costs nothing and it can't drift.
 */
export function GET() {
  const base = siteConfig.url;

  const toolLines = toolsCatalog.map((tool) => {
    const caveat = tool.caveat ? ` Note: ${tool.caveat}` : "";
    return `- [${tool.name}](${base}${tool.href}): ${tool.summary} Accepts ${tool.input}; ${tool.limits}; outputs ${tool.output}.${caveat}`;
  });

  const guideLines = blogPosts.map(
    (post) =>
      `- [${post.title}](${base}/blog/${post.slug}): ${post.description}`,
  );

  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.name} is a free set of PDF and image tools that run in the web browser. Files are processed on the user's device and are not uploaded to a server. No account is required and no watermark is added.`,
    "",
    "## Tools",
    "",
    ...toolLines,
    "",
    "## Categories",
    "",
    `- [${toolCategoryPages.pdf.label}](${base}${toolCategoryPages.pdf.href}): all PDF tools with supported formats and limits`,
    `- [${toolCategoryPages.image.label}](${base}${toolCategoryPages.image.href}): all image tools with supported formats and limits`,
    "",
    "## Guides",
    "",
    ...guideLines,
    "",
    "## Optional",
    "",
    `- [About](${base}/about)`,
    `- [Privacy policy](${base}/privacy-policy)`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
