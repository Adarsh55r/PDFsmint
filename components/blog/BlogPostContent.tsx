import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";

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

        if (block.type === "toolLink") {
          return (
            <div
              key={key}
              className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                {block.text}
              </p>
              <Link
                href={block.href}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {block.label}
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          );
        }

        if (block.type === "table") {
          return (
            <div
              key={key}
              className="overflow-x-auto rounded-xl border border-neutral-200 bg-white"
            >
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-800">
                  <tr>
                    {block.headers.map((header) => (
                      <th key={header} scope="col" className="px-4 py-3 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-600">
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) =>
                        cellIndex === 0 ? (
                          <th
                            key={cellIndex}
                            scope="row"
                            className="px-4 py-3 font-medium text-neutral-900"
                          >
                            {cell}
                          </th>
                        ) : (
                          <td key={cellIndex} className="px-4 py-3">
                            {cell}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
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
