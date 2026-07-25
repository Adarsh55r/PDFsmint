import { Lightbulb } from "lucide-react";

import type { BlogContentBlock } from "@/lib/blog-posts";

type BlogPostContentProps = {
  blocks: BlogContentBlock[];
};

export function BlogPostContent({ blocks }: BlogPostContentProps) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === "heading") {
          return (
            <h2
              key={key}
              className="!mt-10 mb-2 text-xl font-semibold text-neutral-900 sm:text-2xl"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={key}
              className={
                block.ordered
                  ? "list-decimal space-y-2 pl-5 leading-relaxed text-neutral-600"
                  : "list-disc space-y-2 pl-5 leading-relaxed text-neutral-600"
              }
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "tip") {
          return (
            <div
              key={key}
              className="flex gap-3 rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm leading-relaxed text-primary-900 sm:text-base"
            >
              <Lightbulb
                className="mt-0.5 h-5 w-5 shrink-0 text-primary-600"
                strokeWidth={1.75}
                aria-hidden
              />
              <p>{block.text}</p>
            </div>
          );
        }

        return (
          <p key={key} className="leading-relaxed text-neutral-600 sm:text-lg">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
