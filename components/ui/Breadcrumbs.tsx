import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { breadcrumbListJsonLd, JsonLd } from "@/components/seo/JsonLd";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(items)} />
      <nav aria-label="Breadcrumb" className={`mb-6 ${className}`}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0 text-neutral-300"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary-700"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? "font-medium text-neutral-800" : undefined}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
