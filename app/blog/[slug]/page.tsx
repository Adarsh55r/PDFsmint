import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd, articleJsonLd } from "@/components/seo/JsonLd";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { BlogCard } from "@/components/blog/BlogCard";
import { RelatedToolsSection } from "@/components/tools/RelatedToolsSection";
import type { RelatedToolLink } from "@/components/tools/ToolPageTemplate";
import {
  blogPosts,
  getBlogPost,
  getReadingMinutes,
  getRelatedPosts,
} from "@/lib/blog-posts";
import { popularTools } from "@/lib/navigation";
import { formatDate } from "@/lib/format-date";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";

type BlogPostPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const { slug } = params;
  const post = getBlogPost(slug);

  if (!post) {
    return buildMetadata(
      "Post Not Found",
      "The requested blog post could not be found.",
      `/blog/${slug}`,
    );
  }

  return buildMetadata(post.title, post.description, `/blog/${slug}`);
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedTools: RelatedToolLink[] = popularTools
    .filter((tool) => post.relatedTools.includes(tool.href))
    .map((tool) => ({
      href: tool.href,
      label: tool.label,
      description: tool.description ?? "",
    }));
  const relatedPosts = getRelatedPosts(slug);

  return (
    <Container size="narrow" className="py-16 lg:py-20">
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
          publishedAt: post.publishedAt,
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <header className="mb-8">
        <span className="mb-3 inline-flex w-fit rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
          {post.category}
        </span>
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="text-sm text-neutral-500">
          {formatDate(post.publishedAt)} &middot; {getReadingMinutes(post)} min read
        </p>
      </header>

      <article>
        <BlogPostContent blocks={post.content} />
      </article>

      {relatedTools.length > 0 && <RelatedToolsSection tools={relatedTools} />}

      {relatedPosts.length > 0 && (
        <section aria-labelledby="related-posts-heading" className="mt-16">
          <h2 id="related-posts-heading" className="mb-6 text-2xl font-semibold">
            More from the blog
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
