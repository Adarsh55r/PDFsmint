export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-client-side-pdf-tools",
    title: "Why Client-Side PDF Tools Matter",
    description:
      "Privacy, speed, and security — why processing PDFs in the browser is the future.",
    content:
      "When you upload a PDF to a server, you trust a third party with your data. Client-side processing eliminates that risk entirely.",
    publishedAt: "2026-01-15",
  },
];

export const blogPostsBySlug = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post]),
) as Record<string, BlogPost>;

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPostsBySlug[slug];
}
