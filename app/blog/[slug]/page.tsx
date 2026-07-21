import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { getBlogPost } from "@/lib/blog-posts";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";

type BlogPostPageProps = {
  params: { slug: string };
};

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

  return (
    <PageShell
      title={post.title}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog/why-client-side-pdf-tools" },
        { label: post.title },
      ]}
    >
      <article>
        <p className="leading-relaxed text-neutral-600">{post.content}</p>
      </article>
    </PageShell>
  );
}
