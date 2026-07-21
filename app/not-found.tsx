import Link from "next/link";
import { ArrowRight, FileQuestion } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { getToolIcon } from "@/lib/tool-icons";
import { popularTools } from "@/lib/navigation";

const featuredTools = popularTools.slice(0, 6);

export default function NotFound() {
  return (
    <Container size="narrow" className="py-20 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
          <FileQuestion className="h-7 w-7" strokeWidth={1.75} aria-hidden />
        </span>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary-700">
          404 error
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          This page could not be found
        </h1>
        <p className="mb-10 text-base text-muted md:text-lg">
          The page you&rsquo;re looking for may have moved or never existed. Try
          one of our most popular tools instead.
        </p>

        <ul className="grid gap-3 text-left sm:grid-cols-2">
          {featuredTools.map((tool) => {
            const Icon = getToolIcon(tool.href);
            return (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="surface-card group flex items-center gap-3 p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-neutral-900 group-hover:text-primary-800">
                      {tool.label}
                    </span>
                    <span className="block truncate text-xs text-neutral-500">
                      {tool.description}
                    </span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-700"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary-700 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </Container>
  );
}
