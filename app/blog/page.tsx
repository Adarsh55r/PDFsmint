import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BlogCard } from "@/components/blog/BlogCard";
import { blogPosts } from "@/lib/blog-posts";
import { generateMetadata as buildMetadata } from "@/lib/seo-config";

export function generateMetadata(): Metadata {
  return buildMetadata(
    "PDF & Image Guides – Compress, Merge, Convert & Sign",
    "Practical guides on compressing, merging, signing, and converting PDFs and images \u2014 including what each method keeps and what it can\u2019t.",
    "/blog",
  );
}

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <Container size="wide" className="py-16 lg:py-20">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <header className="mb-10 max-w-2xl">
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          PDF and image guides
        </h1>
        <p className="text-base text-muted sm:text-lg">
          Practical, no-nonsense guides for getting the most out of your PDF and image
          tools &mdash; how compression really works, what converts cleanly, and what
          doesn&rsquo;t.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
