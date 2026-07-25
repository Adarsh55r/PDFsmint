import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format-date";
import { getReadingMinutes, type BlogPost } from "@/lib/blog-posts";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="surface-card flex h-full flex-col transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.015] group-hover:border-primary-300 group-hover:shadow-soft-xl">
        <span className="mb-3 inline-flex w-fit rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
          {post.category}
        </span>
        <h3 className="mb-2 text-lg font-semibold text-neutral-900 group-hover:text-primary-800">
          {post.title}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            {formatDate(post.publishedAt)} &middot; {getReadingMinutes(post)} min read
          </span>
          <ArrowRight
            className="h-4 w-4 text-primary-600 transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
      </Card>
    </Link>
  );
}
